export default function Footer() {
    return (
      <footer style={styles.footer}>
        <p>© 2025 JioSaavn. All rights reserved.</p>
      </footer>
    );
  }
  
  const styles = {
    footer: {
      textAlign: "center",
      padding: "1rem",
      backgroundColor: "var(--footer-bg)",
      color: "var(--text)",
      marginTop: "2rem",
      fontSize: "0.9rem",
    },
  };