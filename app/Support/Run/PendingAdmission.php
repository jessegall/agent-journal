<?php

declare(strict_types=1);

namespace App\Support\Run;

use App\Support\CallKey;

/**
 * The admitted run to fetch and start, the request key that takes it, and the environment its child inherits; an
 * empty id names no run.
 */
final readonly class PendingAdmission
{
    private const array SECRET_VARIABLES = [
        'JOURNAL_START_TOKEN',
        'JOURNAL_EVENT_KEY',
    ];

    /**
     * @param  array<string, string>  $environment
     */
    public function __construct(
        public string $admissionId,
        public CallKey $requestKey,
        public array $environment,
    ) {}

    /**
     * @return array<string, string>
     */
    public static function childEnvironment(): array
    {
        return array_diff_key(getenv(), array_flip(self::SECRET_VARIABLES));
    }

    public function isNamed(): bool
    {
        return $this->admissionId !== '';
    }
}
