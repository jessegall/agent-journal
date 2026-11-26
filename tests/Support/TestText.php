<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Agents\Drivers\Hooks\OutageReply;
use App\Contracts\Actors\AgentTexts;
use App\Values\AgentText;
use Illuminate\Container\Container;

/**
 * Whatever words a test puts in an agent's context, as the one text the tests register, and any agent text written
 * out as the agent reads it.
 */
final class TestText
{
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

    public static function renderer(): AgentTexts
    {
        return Container::getInstance()->make(AgentTexts::class);
    }

    public static function outages(): OutageReply
    {
        return Container::getInstance()->make(OutageReply::class);
    }
}
