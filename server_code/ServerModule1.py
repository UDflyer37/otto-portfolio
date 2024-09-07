import anvil.email
import anvil.server

@anvil.server.callable
def send_email(name, message):
  # Send yourself an email each time feedback is submitted
  anvil.email.send(to="ottoa98@gmail.com", 
                   subject=f"Feedback from {name}",
                   text=f"""
                   
  A new person has sent a message!

  Name: {name}
  Feedback:
  {message}
  """)