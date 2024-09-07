from ._anvil_designer import Form1Template
from anvil.js.window import document
import anvil.server
from anvil.js import get_dom_node



class Form1(Form1Template):
  def __init__(self, **properties):
    # Set Form properties and Data Bindings.
    self.init_components(**properties)
    self.dom_nodes['submit'].addEventListener('click', self._handle_click)

  def _handle_click(self, event):
    # Prevent default form submission
    event.preventDefault()

    name = self.dom_nodes['text'].value
    message = self.dom_nodes['message'].value
    # Call the server function to send an email
    anvil.server.call('send_email', name, message)

    self.dom_nodes['text'].value = ""
    self.dom_nodes['message'].value = ""
    alert("Message sent successfully!")
    



    
      