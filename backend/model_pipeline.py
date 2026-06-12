import torch
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification
)
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SentimentAnalyzer:

    def __init__(
        self,
        model_path: str,
        device: str = None
    ):

        self.device = (
            device or
            ("cuda" if torch.cuda.is_available() else "cpu")
        )

        logger.info(
            f"Loading model on {self.device}..."
        )

        try:

            self.tokenizer = (
                AutoTokenizer.from_pretrained(
                    model_path
                )
            )

            self.model = (
                AutoModelForSequenceClassification
                .from_pretrained(model_path)
                .to(self.device)
            )

            self.model.eval()

            # Correct mapping from your training
            # 0 = neutral
            # 1 = positive
            # 2 = negative
            self.id2label = {
                0: "neutral",
                1: "positive",
                2: "negative"
            }

            logger.info(
                f"Loaded labels: {self.id2label}"
            )

            logger.info(
                "Model loaded successfully."
            )

        except Exception as e:

            logger.error(
                f"Failed to load model: {e}"
            )
            raise

    def predict_batch(
        self,
        texts: list[str],
        batch_size: int = 32
    ):

        if not texts:
            return []

        results = []

        for i in range(
            0,
            len(texts),
            batch_size
        ):

            batch_texts = texts[
                i:i + batch_size
            ]

            inputs = self.tokenizer(
                batch_texts,
                return_tensors="pt",
                truncation=True,
                padding=True,
                max_length=85
            )

            inputs = {
                k: v.to(self.device)
                for k, v in inputs.items()
            }

            with torch.no_grad():

                outputs = self.model(
                    **inputs
                )

                probabilities = torch.softmax(
                    outputs.logits,
                    dim=-1
                )

                confidences, predictions = torch.max(
                    probabilities,
                    dim=-1
                )

                for pred, conf in zip(
                    predictions,
                    confidences
                ):

                    results.append(
                        {
                            "sentiment":
                                self.id2label[
                                    pred.item()
                                ],

                            "confidence":
                                round(
                                    conf.item(),
                                    4
                                )
                        }
                    )

        return results

