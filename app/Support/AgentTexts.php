<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\AgentTexts as AgentTextsContract;
use App\Exceptions\AgentTextUnknown;
use App\Exceptions\AgentTextValuesMismatch;
use App\Values\AgentText;
use Illuminate\Contracts\Translation\Translator;

/**
 * Writes an agent text out in words where it reaches an agent's context: an unknown key or a value missing or left
 * over fails, so no text reaches an agent half written.
 */
final readonly class AgentTexts implements AgentTextsContract
{
    private const string PLACEHOLDER = '/\{([a-z_]+)\}/';

    public function __construct(private Translator $translator) {}

    public function render(AgentText $text): string
    {
        $registered = $this->registered($text->key);

        preg_match_all(self::PLACEHOLDER, $registered, $placeholders);
        $declared = array_values(array_unique($placeholders[1]));
        $given = array_keys($text->values);
        sort($declared);
        sort($given);

        if ($declared !== $given) {
            throw AgentTextValuesMismatch::forKey($text->key, $declared, $given);
        }

        $replacements = [];

        foreach ($text->values as $name => $value) {
            $replacements['{'.$name.'}'] = $value instanceof AgentText ? $this->render($value) : (string) $value;
        }

        return strtr($registered, $replacements);
    }

    /**
     * @throws AgentTextUnknown
     */
    private function registered(string $key): string
    {
        [$owner, $name] = explode('.', $key, 2) + [1 => ''];
        $line = $owner === 'core' ? "agent.{$name}" : "{$owner}::agent.{$name}";
        $registered = $this->translator->get($line);

        if (is_string($registered) && $registered !== $line) {
            return $registered;
        }

        throw AgentTextUnknown::forKey($key);
    }
}
