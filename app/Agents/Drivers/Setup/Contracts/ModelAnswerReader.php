<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup\Contracts;

/**
 * Reads a driver's answer to one short model call: the provider's refusal, or none when it answered.
 */
interface ModelAnswerReader
{
    /**
     * The refusal the model check printed, or null when the model answered.
     */
    public function __invoke(string $output, int|null $exitCode): string|null;
}
