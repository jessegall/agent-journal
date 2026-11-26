<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Accounts\Data\ClaudeAnswerData;
use App\Agents\Drivers\Setup\Contracts\ModelAnswerReader;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

/**
 * Reads `claude -p --output-format json`: answered when it exits cleanly without an error, the provider's refusal when
 * not; the status trusts any key or token, so this call is the only proof one works.
 */
final readonly class ClaudeCodeModelAnswer implements ModelAnswerReader
{
    public function __invoke(string $output, int|null $exitCode): string|null
    {
        try {
            $answer = ClaudeAnswerData::from(json_decode($output, true, 512, JSON_THROW_ON_ERROR));
        } catch (JsonException|CannotCreateData|TypeError) {
            return 'Claude Code gave no readable answer.';
        }

        if ($exitCode === 0 && ! $answer->isError) {
            return null;
        }

        if ($answer->result === '') {
            return 'Claude Code could not reach the model.';
        }

        return $answer->result;
    }
}
