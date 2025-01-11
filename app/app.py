import openai

filename = "output_topic_details.txt"
retrieval_model_name = 'output/sentence-transformer-finetuned/'

openai.api_key = os.environ["OPENAI_API_KEY"]
