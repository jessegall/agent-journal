<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Values\AgentText;

/**
 * Whatever words a test puts in an agent's context, as the one text the tests register.
 */
final class TestText
{
    public static function of(string $text): AgentText
    {
        return AgentText::of('tests.said', ['text' => $text]);
    }
}
