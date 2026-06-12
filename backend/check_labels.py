from transformers import AutoModelForSequenceClassification

model = AutoModelForSequenceClassification.from_pretrained("./model")

print(model.config.id2label)