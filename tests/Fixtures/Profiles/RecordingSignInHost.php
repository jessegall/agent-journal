<?php

declare(strict_types=1);

namespace Tests\Fixtures\Profiles;

use App\Profiles\Contracts\SignInHost;
use App\Profiles\Enums\SignInOutcome;
use App\Profiles\Values\ClaimedSignIn;

/**
 * A host that hands out one sign-in and remembers each report.
 */
final class RecordingSignInHost implements SignInHost
{
    /**
     * @var list<SignInOutcome>
     */
    public array $outcomes = [];

    /**
     * @var list<string|null>
     */
    public array $identities = [];

    public function __construct(private ClaimedSignIn|null $next) {}

    public function claim(): ClaimedSignIn|null
    {
        [$claimed, $this->next] = [$this->next, null];

        return $claimed;
    }

    public function report(ClaimedSignIn $claimed, SignInOutcome $outcome, string|null $identity): void
    {
        $this->outcomes[] = $outcome;
        $this->identities[] = $identity;
    }
}
