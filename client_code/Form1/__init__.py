from ._anvil_designer import Form1Template
from anvil import 
import anvil.server



class Form1(Form1Template):
  def __init__(self, **properties):
    # Set Form properties and Data Bindings.
    self.init_components(**properties)
    self.dom_nodes['send'].addEventListener('click', self._send_click)

    
  def submit_click(self, **event_args):
      """Triggered when the submit button is clicked"""
      name = self.text.text  # Get the value from the Name input field
      message = self.message.text  # Get the value from the Message textarea

      # Call the backend function to send the email
      anvil.server.call('send_email', name, message)

      # Optionally show a success message
      alert(f"Thank you, {name}! Your message has been sent.")

    
      