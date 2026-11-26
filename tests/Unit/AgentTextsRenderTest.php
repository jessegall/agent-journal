<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Actors\Contracts\AgentTexts;
use App\Actors\Exceptions\AgentTextUnknown;
use App\Actors\Exceptions\AgentTextValuesMismatch;
use App\Support\DomainRegistry;
use App\Values\AgentText;
use Illuminate\Contracts\Translation\Translator;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * Every text registered for agents, Core's and each domain's, renders once with a value for each of its placeholders,
 * and the renderer refuses an unknown key and a value missing or left over.
 */
final class AgentTextsRenderTest extends TestCase
{
    private const string PLACEHOLDER = '/\{([a-z_]+)\}/';

    private const string UNFILLED = 'This text left a placeholder unfilled: %s';

    public function test_every_registered_text_renders_with_its_placeholders(): void
    {
        $renderer = $this->app->make(AgentTexts::class);
        $rendered = 0;

        foreach ($this->registeredTexts() as $key => $line) {
            preg_match_all(self::PLACEHOLDER, $line, $placeholders);
            $values = array_fill_keys(array_unique($placeholders[1]), 'value');

            $this->assertDoesNotMatchRegularExpression(
                self::PLACEHOLDER,
                $renderer->render(AgentText::of($key, $values)),
                sprintf(self::UNFILLED, $key),
            );
            $rendered++;
        }

        $this->assertGreaterThan(0, $rendered);
    }

    public function test_an_unknown_key_is_refused(): void
    {
        $this->expectException(AgentTextUnknown::class);

        $this->app->make(AgentTexts::class)->render(AgentText::of('core.no_such_text'));
    }

    public function test_a_missing_value_is_refused(): void
    {
        $this->expectException(AgentTextValuesMismatch::class);

        $this->app->make(AgentTexts::class)->render(AgentText::of('tests.said'));
    }

    public function test_a_text_given_as_a_value_is_rendered_in_place(): void
    {
        $text = AgentText::of('tests.said', ['text' => AgentText::of('tests.said', ['text' => 'inner'])]);

        $this->assertSame('inner', $this->app->make(AgentTexts::class)->render($text));
    }

    /**
     * Each registered text by its agent key, Core's under core and each domain's under its snake-case name.
     *
     * @return array<string, string>
     */
    private function registeredTexts(): array
    {
        $translator = $this->app->make(Translator::class);
        $owners = ['core' => 'agent'];

        foreach ($this->app->make(DomainRegistry::class)->all() as $entry) {
            $owner = Str::snake($entry->name);
            $owners[$owner] = "{$owner}::agent";
        }

        $texts = [];

        foreach ($owners as $owner => $file) {
            $lines = $translator->get($file);

            foreach (is_array($lines) ? Arr::dot($lines) : [] as $name => $line) {
                $texts["{$owner}.{$name}"] = (string) $line;
            }
        }

        return $texts;
    }
}
