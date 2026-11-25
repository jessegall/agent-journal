<?php

declare(strict_types=1);

namespace App\Console\Concerns;

use App\Attributes\Rules\DecodesAnyJson;
use App\Contracts\Bus\PipelineDefinition;
use App\Contracts\Domains\CallSender;
use App\Contracts\Domains\JournalCall;
use App\Exceptions\CommandStopped;
use App\Pipelines\RunSignedCallPipeline;
use App\Support\CallKey;
use App\Support\PipelineRunner;
use App\Values\CommandReport;
use App\Values\PendingCall;
use Closure;
use Illuminate\Container\Container;
use JsonException;
use Spatie\LaravelData\Data;

/**
 * The console boundary of signed calls: a command runs its pipeline to a report and prints it; a failure prints its
 * own lines and, for a keyed write, how to get its answer again without making it twice.
 */
trait RunsCallPipelines
{
    /**
     * @param  class-string<PipelineDefinition<object, object>>  $pipeline
     */
    protected function runCalls(string $pipeline, object $input): int
    {
        return $this->runReport(
            fn (): CommandReport => Container::getInstance()->make(PipelineRunner::class)->run(
                $pipeline,
                $input,
                CommandReport::class,
            ),
        );
    }

    /**
     * Runs the calls a command makes and prints the report it builds from their answers, or answers the status of a
     * command that printed them itself; a failure prints its own lines and, for a keyed write, how to get its answer
     * again without making it twice.
     *
     * @param  Closure(): (CommandReport|int)  $report
     */
    protected function runReport(Closure $report): int
    {
        try {
            $printed = $report();
        } catch (CommandStopped $stopped) {
            foreach ($stopped->consoleLines() as $line) {
                $this->error($line);
            }

            $key = $stopped->retryKey();

            if ($key !== null) {
                $this->line(
                    "Retry with --request-key={$key->value} to get this write's answer without making it twice.",
                );
            }

            return self::FAILURE;
        }

        if (is_int($printed)) {
            return $printed;
        }

        $printed->printTo($this);

        return $printed->status;
    }

    /**
     * Runs one signed call and prints its answer, as one JSON line with --json.
     *
     * @param  JournalCall<Data>  $call
     */
    protected function runCall(JournalCall $call): int
    {
        $oneLine = $this->input->hasOption('json') && $this->input->getOption('json') === true;

        return $this->runCalls(RunSignedCallPipeline::class, new PendingCall($call, $oneLine));
    }

    /**
     * The key a write goes under: --request-key when given, so a retry gets its answer, else a new one.
     */
    protected function requestKey(): CallKey
    {
        $option = $this->input->hasOption('request-key') ? $this->input->getOption('request-key') : null;

        return CallKey::fromOption(is_string($option) && $option !== '' ? $option : null);
    }

    /**
     * Reads an option written as a JSON object; a broken one prints why and answers null. The object is sent on as
     * the user wrote it, for the journal to check field by field with its own named errors.
     *
     * @return array<string, mixed>|null
     */
    #[DecodesAnyJson]
    protected function jsonOption(string $name): array|null
    {
        try {
            $text = $this->input->getOption($name);
            $decodedReply = json_decode(is_string($text) ? $text : '', true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $broken) {
            $this->error("The {$name} is not JSON: {$broken->getMessage()}");

            return null;
        }

        if (! is_array($decodedReply)) {
            $this->error("The {$name} is not a JSON object.");

            return null;
        }

        return $decodedReply;
    }

    /**
     * The first and last line of a --lines span written as 12-16, or an empty list when none is given.
     *
     * @return array{}|array{int, int}
     */
    protected function lineSpan(): array
    {
        $lines = $this->input->hasOption('lines') ? $this->input->getOption('lines') : null;

        if (! is_string($lines)) {
            return [];
        }

        if (preg_match('/^(\d+)-(\d+)$/', $lines, $span) !== 1) {
            return [];
        }

        return [
            (int) $span[1],
            (int) $span[2],
        ];
    }

    /**
     * Sends one call inside runReport and answers its typed answer.
     *
     * @template TAnswer of Data
     *
     * @param  JournalCall<TAnswer>  $call
     * @return TAnswer
     */
    protected function sendCall(JournalCall $call): Data
    {
        return Container::getInstance()->make(CallSender::class)->send($call);
    }
}
