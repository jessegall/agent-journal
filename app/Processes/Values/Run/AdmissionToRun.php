<?php

declare(strict_types=1);

namespace App\Processes\Values\Run;

/**
 * The admitted run to fetch and start, with the environment its child inherits; an empty id names no run.
 */
final readonly class AdmissionToRun
{
    /**
     * @param  array<string, string>  $environment
     */
    public function __construct(public string $admissionId, public array $environment) {}

    public function isNamed(): bool
    {
        return $this->admissionId !== '';
    }
}
