export default function ContactCard({ contact, onDelete }) {
  return (
    <div className="contact-card">
      <span>{contact.name} ({contact.phone})</span>
      <button onClick={() => onDelete(contact.id)}>✕</button>
    </div>
  );
}