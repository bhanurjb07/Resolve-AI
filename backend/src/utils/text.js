const HTML_ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };

//cleaning the tweet in a structured format
export function cleanTweet(text = '') {
  return text
    .replace(/&(amp|lt|gt|quot|#39);/g, (m) => HTML_ENTITIES[m])
    .replace(/https?:\/\/\S+/g, '[link]')
    .replace(/^(\s*@\w+\s*)+/, '')             //leading @mentions
    .replace(/(^|[^\w.])@\w+/g, '$1@user')     //any other @mentions -> anonymous (emails untouched)
    .replace(/\s+/g, ' ')
    .trim();
}

//Brand agents sign tweets like "/AY", "^MM" or "-JS". Remove it so drafts don't copy initials.
export function removeAgentSignature(text = '') {
  return text.replace(/\s*(\/|\^|-)\s?[A-Z]{1,3}\s*$/, '').trim();
}

export function cleanBrandReply(text = '') {
  return removeAgentSignature(cleanTweet(text));
}

//Does the reply only move the customer to a private channel
export function isDmDeflection(text = '') {
  return /\b(DM|direct message|send us a (private )?message|private message|reach out (to us )?(via|in) DM)\b/i.test(text);
}

// Email address, phone number or card-like number in the text.
export function containsPersonalData(text = '') {
  return (
    /[\w.+-]+@[\w-]+\.[\w.]+/.test(text) ||
    /__email__/.test(text) ||
    /(\+?\d[\d\s-]{9,}\d)/.test(text)
  );
}

//Keeping tweets with at least 4 real words and mostly latin letters
export function isUsableCustomerText(text = '') {
  const words = text.split(/\s+/).filter((w) => /[a-z]/i.test(w));
  const letters = text.match(/\p{L}/gu) || [];
  const latin = letters.filter((ch) => /[a-z]/i.test(ch));
  return words.length >= 4 && text.length <= 400 && latin.length / (letters.length || 1) > 0.8;
}