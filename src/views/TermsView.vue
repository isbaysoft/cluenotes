<template>
  <div class="terms-view">
    <h1>Terms of Use & Privacy Policy</h1>
    <p class="last-updated"><strong>Last updated:</strong> March 11, 2026</p>

    <section class="term-section">
      <h2>1. General Information</h2>
      <p>
        Welcome to <strong>Clue Notes Web</strong> (the "Website"). By accessing or using this
        Website, you agree to be bound by these Terms. If you disagree with any part of these terms,
        you may not use the Website.
      </p>
    </section>

    <section class="term-section">
      <h2>2. Unofficial Fan Project (Copyright Notice)</h2>
      <p>This Website is an <strong>unofficial fan tool</strong> created for personal use.</p>
      <ul>
        <li>
          <strong>Not Affiliated:</strong> This project is <strong>not</strong> affiliated with,
          endorsed, sponsored, or specifically approved by <strong>Hasbro, Inc.</strong>, generic
          Cluedo publishers, or any of their affiliates.
        </li>
        <li>
          <strong>Trademarks:</strong> Clue®, Cluedo®, and all related characters, artwork, and
          game mechanics are trademarks of their respective owners.
        </li>
        <li>
          <strong>Fair Use:</strong> The use of terminology and imagery is intended solely for
          identification and descriptive purposes in the context of a companion tool.
        </li>
      </ul>
    </section>

    <section class="term-section">
      <h2>3. Privacy & Data Storage (Local Storage)</h2>
      <p>We respect your privacy. Here is how we handle your data:</p>
      <ul>
        <li>
          <strong>No Server Storage:</strong> We do <strong>not</strong> collect, store, or transmit
          your game data to any external servers.
        </li>
        <li>
          <strong>Local Storage:</strong> All your game notes, settings, and history are stored
          locally in your browser's memory (Local Storage / Cookies).
        </li>
        <li>
          <strong>Data Loss:</strong> If you clear your browser cache, use "Incognito/Private" mode,
          or switch devices, your saved game data may be lost. The developer is not responsible for
          any data loss.
        </li>
      </ul>
    </section>

    <section class="term-section">
      <h2>4. "Support me" (Donations)</h2>
      <p>The Website includes a button to support the developer via voluntary donations.</p>
      <ul>
        <li>
          <strong>Voluntary:</strong> Donations are completely optional and are not required to
          access any features of the Website.
        </li>
        <li>
          <strong>Non-Refundable:</strong> Any funds sent are considered a <strong>gift</strong> to
          the developer and are non-refundable.
        </li>
        <li>
          <strong>No Goods/Services:</strong> A donation does not entitle you to any special
          features, advantages, or digital goods within the game.
        </li>
      </ul>
    </section>

    <section class="term-section">
      <h2>5. Disclaimer of Warranties ("As Is")</h2>
      <p>
        The Website is provided on an <strong>"AS IS"</strong> and
        <strong>"AS AVAILABLE"</strong> basis. The developer makes no warranties that:
      </p>
      <ul>
        <li>The Website will be uninterrupted, timely, secure, or error-free.</li>
        <li>
          The results or logic helpers provided by the app will <strong>not</strong> be 100%
          accurate (it is a tool to assist, not replace, player judgment).
        </li>
      </ul>
    </section>

    <section class="term-section">
      <h2>6. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, the developer shall not be liable for any direct,
        indirect, incidental, or consequential damages resulting from the use or inability to use
        this Website.
      </p>
    </section>

    <section class="term-section">
      <h2>7. Contact</h2>
      <p>
        If you have any questions regarding these Terms, the Application, or if you have any
        suggestions or relevant inquiries, you can contact the developer at:
        <a href="mailto:cluenotes.app@proton.me">cluenotes.app@proton.me</a>
      </p>
    </section>

    <p v-if="!asModal" class="back-to-home">
      <RouterLink to="/">&#8592; Back to Home</RouterLink>
    </p>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    asModal?: boolean
  }>(),
  {
    asModal: false,
  },
)
</script>

<style lang="scss" scoped>
.terms-view {
  text-align: left;
  line-height: 1.6;
  color: $white;
  padding: $padding;

  h1 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  h2 {
    font-size: 1.2rem;
    margin-top: 1.5rem;
    margin-bottom: 0.8rem;
    padding-bottom: 5px;
  }

  .last-updated {
    text-align: center;
    font-size: 0.9rem;
    margin-bottom: 2rem;
    opacity: 0.8;
  }

  .back-to-home {
    text-align: center;
    padding: $padding * 2;
  }

  ul {
    padding-left: 20px;

    li {
      margin-bottom: 8px;
    }
  }

  a {
    color: $white;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
