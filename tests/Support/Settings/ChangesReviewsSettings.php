<?php

declare(strict_types=1);

namespace Tests\Support\Settings;

use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Models\Records\SettingsRecord;
use App\Values\SettingsChange;
use Closure;
use Throwable;

/**
 * Runs settings commands, writes the Reviews settings document straight to its record around them, and expects a
 * command refused.
 */
trait ChangesReviewsSettings
{
    /**
     * @param  Command<SettingsChange>  $command
     */
    private function runCommand(Command $command): SettingsChange
    {
        return $this->app->make(CommandBus::class)->run($command);
    }

    /**
     * @param  class-string<Throwable>  $refusal
     * @param  Command<mixed>  $command
     */
    private function assertRefused(string $refusal, Command $command): void
    {
        try {
            $this->runCommand($command);
            $this->fail(sprintf('The command was not refused with %s.', $refusal));
        } catch (Throwable $thrown) {
            $this->assertInstanceOf($refusal, $thrown);
        }
    }

    private function storeDirectly(Closure $change): void
    {
        SettingsRecord::create('Reviews');
        $record = SettingsRecord::sharedRuntimeForOwner('Reviews')->get();
        $record->revise($change($record->document));
    }
}
