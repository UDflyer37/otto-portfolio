from ._anvil_designer import Form1Template
from anvil.js.window import document
import anvil.server
from anvil.js import get_dom_node



class Form1(Form1Template):
  def __init__(self, **properties):
    # Set Form properties and Data Bindings.
    self.init_components(**properties)
    my_element = self.dom_nodes['m']


    
  def handle_submit(event):
    # Prevent the form from refreshing the page
    event.preventDefault()
    
    # Capture the name and message input values using DOM nodes
    name = document.querySelector('[anvil-name="text"]').value
    message = document.querySelector('[anvil-name="message"]').value
    
    # Call the server function to send an email
    anvil.server.call('send_email', name, message)

document.querySelector('[anvil-name="submit"]').addEventListener('click', handle_submit)

    
      