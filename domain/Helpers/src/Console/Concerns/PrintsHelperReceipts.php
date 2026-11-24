<?php

declare(strict_types=1);

namespace Domain\Helpers\Console\Concerns;

use App\Values\CommandReport;
use Domain\Helpers\Data\HelperReceiptData;

/**
 * How the helper commands read their options and print a dispatch receipt, and the refusal of a start that names no
 * model.
 */
trait PrintsHelperReceipts
{
    private const string MODEL_REQUIRED = 'model-required: a helper start names its model; pass --model=<model>, or '
        .'--model=default for the profile default.';

    private function receiptReport(HelperReceiptData $receipt): CommandReport
    {
        return CommandReport::ending(self::SUCCESS)
            ->line("Helper {$receipt->identityId}, job {$receipt->jobId} ({$receipt->state})")
            ->line("Type {$receipt->profileType}, profile revision {$receipt->profileRevision}")
            ->line("Conversation {$receipt->conversationMode}: {$receipt->conversationReason}")
            ->line(sprintf(
                'Model requested %s, resolved %s on %s, actual: %s',
                $receipt->requestedModel ?? $receipt->requestedModelType,
                $receipt->resolvedModel,
                $receipt->driver,
                $receipt->actualModel,
            ))
            ->line("Launch {$receipt->launchReference}, runs {$receipt->executionMode}");
    }

    /**
     * The model the command names; a command without one is refused before any call.
     */
    private function namedModel(): string|null
    {
        return $this->textOption('model');
    }

    /**
     * An option's text, or null when it was left out or empty.
     */
    private function textOption(string $name): string|null
    {
        $optionText = $this->option($name);

        if (is_string($optionText) && $optionText !== '') {
            return $optionText;
        }

        return null;
    }
}
