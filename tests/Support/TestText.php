<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Contracts\AgentTexts;
use App\Agents\Drivers\Hooks\OutageReply;
use App\Values\AgentText;
use Illuminate\Container\Container;

/**
 * Whatever words a test puts in an agent's context, as the one text the tests register, and any agent text written
 * out as the agent reads it.
 */
final class TestText
{
    /**
     * A value of a text that stands for any words in its pattern.
     */
    public const string ANY = "\u{1}any\u{1}";

    public static function of(string $text): AgentText
    {
        return AgentText::of('tests.said', ['text' => $text]);
    }

    /**
     * The text as the agent reads it.
     */
    public static function words(AgentText $text): string
    {
        return self::renderer()->render($text);
    }

    /**
     * A pattern of the text as the agent reads it, where each value given as ANY stands for any words.
     */
    public static function pattern(AgentText $text): string
    {
        $parts = explode(self::ANY, self::words($text));

        return '/^'.implode('.+', array_map(fn (string $part) => preg_quote($part, '/'), $parts)).'$/s';
    }

    public static function renderer(): AgentTexts
    {
        return Container::getInstance()->make(AgentTexts::class);
    }

    public static function outages(): OutageReply
    {
        return Container::getInstance()->make(OutageReply::class);
    }
}
