import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLang, targetLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    console.log('🌍 Translation request:', { sourceLang, targetLang, textLength: text.length });

    // Try OpenAI first (best quality), then fallback to free services
    const translatedText = await translateText(text, sourceLang, targetLang);

    console.log('✅ Translation successful, length:', translatedText.length);

    return NextResponse.json({ translatedText });
  } catch (error: any) {
    console.error('❌ Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed', details: error.message },
      { status: 500 }
    );
  }
}

const languageNames: { [key: string]: string } = {
  es: 'Spanish',
  en: 'English',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  ar: 'Arabic',
  hi: 'Hindi',
  nl: 'Dutch',
  pl: 'Polish',
  tr: 'Turkish',
};

async function translateText(text: string, sourceLang: string | undefined, targetLang: string): Promise<string> {
  // Try OpenAI GPT for translation (best quality)
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      console.log('🤖 Using OpenAI for translation...');
      return await translateWithOpenAI(text, sourceLang, targetLang, apiKey);
    } catch (error) {
      console.error('OpenAI translation error:', error);
      // Continue to fallback
    }
  }

  // Fallback to free services
  try {
    console.log('🌐 Using MyMemory API...');
    const langPair = sourceLang ? `${sourceLang}|${targetLang}` : `auto|${targetLang}`;
    const encodedText = encodeURIComponent(text.substring(0, 500)); // MyMemory has 500 char limit

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}`
    );

    if (!response.ok) {
      throw new Error('MyMemory API request failed');
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    throw new Error('Translation not available');
  } catch (error) {
    console.error('MyMemory translation error:', error);
    throw new Error('Translation service unavailable. Please configure OpenAI API key for better translation.');
  }
}

async function translateWithOpenAI(
  text: string,
  sourceLang: string | undefined,
  targetLang: string,
  apiKey: string
): Promise<string> {
  const targetLanguageName = languageNames[targetLang] || targetLang;
  const sourceLanguageName = sourceLang && sourceLang !== 'auto' ? languageNames[sourceLang] : 'the source language';

  const prompt = `Translate the following text from ${sourceLanguageName} to ${targetLanguageName}. Only provide the translation, no explanations:\n\n${text}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator. Translate the text accurately while preserving the original meaning and tone.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('OpenAI API error:', error);
    throw new Error(error.error?.message || 'OpenAI translation failed');
  }

  const data = await response.json();
  const translatedText = data.choices[0]?.message?.content?.trim();

  if (!translatedText) {
    throw new Error('No translation returned from OpenAI');
  }

  return translatedText;
}

