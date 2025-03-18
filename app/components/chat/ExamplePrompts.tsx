import React from 'react';

const EXAMPLE_PROMPTS = [
  { text: 'Create a 3D scene with a rotating cube and bouncing balls using Three.js' },
  { text: 'Build an AI storybook generator that creates illustrated children\'s stories' },
  { text: 'Create a music visualizer that generates AI art based on MIDI input' },
  { text: 'Make an AI character roleplay chat with dynamic avatar generation' },
  { text: 'Build a CalorieAI app that analyzes food photos for nutritional content' },
  { text: 'Create an interactive text adventure game with AI-generated scene images' },
  { text: 'Make a "Paint with Weather" app that generates art based on local weather data. Use searchgpt model for getting weather.' },
  { text: 'Create a "Dream Diary" that illustrates your written dreams with AI art' },
  { text: 'Build a "Pet Portrait Studio" that turns photos into different art styles' },
  { text: 'Make a "Time Travel Postcard" generator with historical style images' },
  { text: 'Create an "Emoji Story" generator that turns emojis into illustrated scenes' },
  { text: 'Build a "Recipe Visualizer" that shows ingredients as artistic compositions' }
];

export function ExamplePrompts(sendMessage?: { (event: React.UIEvent, messageInput?: string): void | undefined }) {
  return (
    <div id="examples" className="relative flex flex-col gap-9 w-full max-w-3xl mx-auto flex justify-center mt-6">
      <div
        className="flex flex-wrap justify-center gap-2"
        style={{
          animation: '.25s ease-out 0s 1 _fade-and-move-in_g2ptj_1 forwards',
        }}
      >
        {EXAMPLE_PROMPTS.map((examplePrompt, index: number) => {
          return (
            <button
              key={index}
              onClick={(event) => {
                sendMessage?.(event, examplePrompt.text);
              }}
              className="border border-bolt-elements-borderColor rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-900 text-white hover:text-[#ecf874] px-3 py-1 text-xs transition-theme"
            >
              {examplePrompt.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
