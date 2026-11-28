<?php

declare(strict_types=1);

namespace App\Support\Recordings\Scenarios;

use App\Values\SignInChallenge;

/**
 * An ask-user step as the player shows it: the words to the user and, while a sign-in waits, its challenge, the link
 * and any code the user enters there; the player waits for the user's line, the code a sign-in page gave or nothing
 * but Enter.
 */
final readonly class ScenarioPause
{
    public function __construct(public string $text, public SignInChallenge|null $signIn) {}
}
