from ._anvil_designer import Home_PageTemplate
from anvil.js.window import document
import anvil.server
from anvil.js import get_dom_node
from ..CTF import CTF


class Home_Page(Home_PageTemplate):
  def __init__(self, **properties):
    # Set Form properties and Data Bindings.
    self.init_components(**properties)
    self.scroll_into_view(smooth=True)
    self.dom_nodes['submit'].addEventListener('click', self._submit_click)
    self.dom_nodes['ctf_page'].addEventListener('click', self._ctf_page_click)
    

  def _submit_click(self, event):
    # Prevent default form submission
    event.preventDefault()

    name = self.dom_nodes['name'].value
    email = self.dom_nodes['email'].value
    message = self.dom_nodes['message'].value
    # Call the server function to send an email
    anvil.server.call('send_email', name, email, message)

    self.dom_nodes['name'].value = ""
    self.dom_nodes['email'].value = ""
    self.dom_nodes['message'].value = ""
    anvil.alert(content="Message sent successfully!", title=f"Thank you, {name}", buttons=None)
    
  def _ctf_page_click(self, event):
    # Prevent default form submission
    event.preventDefault()

    anvil.open_form('CTF')

    

      


    
      