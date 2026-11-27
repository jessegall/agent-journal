<?php

declare(strict_types=1);

namespace App\Processes;

use App\Attributes\Rules\DecodesAnyJson;
use App\CommandRules\Enums\FramingType;
use App\CommandRules\Enums\OutputEncoding;
use App\CommandRules\Enums\StreamUse;
use App\CommandRules\Enums\SummaryRule;
use App\Processes\Enums\ClaimedOutcome;
use App\Processes\Enums\OutputStream;
use App\Processes\Enums\ProblemCode;
use App\Processes\Resolvers\Support\CheckpointBuilder;
use App\Processes\Resolvers\Support\LineNormalizer;
use App\Processes\Values\OutputFrame;
use App\Processes\Values\OutputRecord;
use App\Processes\Values\ReaderAssessment;
use App\Processes\Values\ReaderCheckpoint;
use App\Processes\Values\ReadProgress;
use App\Records\Enums\RecordRole;
use App\Values\OutputContract;
use App\Values\PartEnd;
use App\Values\ReaderDefinition;

/**
 * Reads a part's committed output with one declarative definition under its output contract. Each stream is decoded apart: a line is read once, when its newline arrives, so a line or a character
 * split across chunks is never cut and stdout and stderr are never joined. Every substantive line must be accounted
 * for by a rule; any other line, encoding fault or limit becomes a problem, and all problems are kept together.
 */
final readonly class DeclarativeReader
{
    public function __construct(
        private ReaderDefinition $definition,
        private OutputContract $contract,
        private string $revision,
        private LineNormalizer $normalizer = new LineNormalizer(),
    ) {}

    public function read(ReaderCheckpoint $from, OutputFrame ...$frames): ReaderCheckpoint
    {
        $builder = new CheckpointBuilder($from, $this->revision);
        $deadline = hrtime(true) + $this->definition->millisecondBudget * 1_000_000;

        foreach ($frames as $frame) {
            if (hrtime(true) > $deadline) {
                $builder->problemOfWholeOutput(ProblemCode::ReaderFailed, 'The reader ran past its time budget.');

                break;
            }

            $this->readFrame($builder, $frame);
        }

        return $builder->build();
    }

    public function finish(ReaderCheckpoint $at, PartEnd $end): ReaderAssessment
    {
        $builder = new CheckpointBuilder($at, $this->revision);

        foreach ($builder->streamsWithPending() as $stream) {
            $this->readLastLine($builder, OutputStream::from($stream));
        }

        if (! $end->hasEnded()) {
            $builder->problemOfWholeOutput(
                ProblemCode::OutputIncomplete,
                'The part has not ended, so its output is not whole.',
            );
        }

        $checkpoint = $builder->build();
        $summaries = $checkpoint->recordsOf(RecordRole::Summary);
        $this->checkSummaries($builder, $summaries);
        $summary = $summaries === [] ? null : $summaries[array_key_last($summaries)];
        $counts = $this->countsOf($builder, $summary);
        $progress = $this->progressOf($builder, $checkpoint, $summary);
        $final = $builder->build();

        $claimed = $this->claimOf($summary, $final->recordsOf(RecordRole::Outcome), $final->records === []);

        return new ReaderAssessment($final->records, $final->problems, $counts, $progress, $claimed);
    }

    private function readFrame(CheckpointBuilder $builder, OutputFrame $frame): void
    {
        if ($frame->stream === OutputStream::Merged && $this->contract->streams === StreamUse::Separate) {
            $explanation = 'Merged output arrived although the contract keeps stdout and stderr apart.';

            $builder->problem(
                ProblemCode::OutputAmbiguous,
                $frame->stream,
                $frame->offset,
                $frame->end(),
                $explanation,
            );

            return;
        }

        $expected = $builder->offsetOf($frame->stream);

        if ($frame->end() <= $expected) {
            return;
        }

        if ($frame->offset > $expected) {
            $explanation = 'Bytes are missing between two committed chunks.';
            $builder->problem(ProblemCode::OutputIncomplete, $frame->stream, $expected, $frame->offset, $explanation);
            $expected = $frame->offset;
        }

        $pending = $builder->pendingOf($frame->stream);
        $bytes = $pending.substr($frame->bytes, $expected - $frame->offset);
        $this->readLines($builder, $frame->stream, $expected - strlen($pending), $bytes);
    }

    /**
     * Reads every complete line of the bytes and holds the unfinished rest until the next chunk or the end.
     */
    private function readLines(CheckpointBuilder $builder, OutputStream $stream, int $start, string $bytes): void
    {
        $lineStart = 0;

        while (($newline = strpos($bytes, "\n", $lineStart)) !== false) {
            $this->readLine($builder, $stream, $start + $lineStart, substr($bytes, $lineStart, $newline - $lineStart));
            $lineStart = $newline + 1;
        }

        $rest = substr($bytes, $lineStart);

        if (strlen($rest) > $this->definition->maxRecordBytes) {
            $explanation = 'A record is longer than the reader allows.';

            $builder->problem(
                ProblemCode::RecordLimit,
                $stream,
                $start + $lineStart,
                $start + strlen($bytes),
                $explanation,
            );

            $rest = '';
        }

        $builder->holdUntilMore($stream, $rest, $start + strlen($bytes));
    }

    /**
     * At the end, the unfinished line of a stream is a record only when the framing lets the end close a line.
     */
    private function readLastLine(CheckpointBuilder $builder, OutputStream $stream): void
    {
        $rest = $builder->pendingOf($stream);
        $start = $builder->offsetOf($stream) - strlen($rest);
        $builder->holdUntilMore($stream, '', $builder->offsetOf($stream));

        if ($this->contract->framing !== FramingType::Lines) {
            $explanation = 'The output ended inside a record.';
            $builder->problem(ProblemCode::OutputIncomplete, $stream, $start, $start + strlen($rest), $explanation);

            return;
        }

        $this->readLine($builder, $stream, $start, $rest);
    }

    private function readLine(CheckpointBuilder $builder, OutputStream $stream, int $start, string $bytes): void
    {
        $end = $start + strlen($bytes);

        if (strlen($bytes) > $this->definition->maxRecordBytes) {
            $builder->problem(
                ProblemCode::RecordLimit,
                $stream,
                $start,
                $end,
                'A record is longer than the reader allows.',
            );

            return;
        }

        if ($this->contract->encoding === OutputEncoding::Utf8 && ! mb_check_encoding($bytes, 'UTF-8')) {
            $builder->problem(ProblemCode::OutputEncoding, $stream, $start, $end, 'The bytes are not valid UTF-8.');

            return;
        }

        $line = $this->lineOf($this->normalizer->normalize($bytes));

        if (trim($line) === '') {
            return;
        }

        if ($this->normalizer->hasUnsupportedControl($line)) {
            $this->unrecognized($builder, $stream, $start, $end);

            return;
        }

        $rule = $this->definition->ruleFor($line);

        if ($rule === null) {
            $this->unrecognized($builder, $stream, $start, $end);

            return;
        }

        $builder->record(new OutputRecord($stream, $start, $end, $rule->role, $rule->captures($line)));
    }

    private function unrecognized(CheckpointBuilder $builder, OutputStream $stream, int $start, int $end): void
    {
        $builder->problem(
            ProblemCode::OutputUnrecognized,
            $stream,
            $start,
            $end,
            'No reader rule accounts for this line.',
        );
    }

    /**
     * A JSON-lines record is matched as its top-level fields written key=value in their order; other framings read the
     * line as it is. The keys are the tool's own JSON, which the journal does not name.
     */
    #[DecodesAnyJson]
    private function lineOf(string $line): string
    {
        if ($this->contract->framing !== FramingType::JsonLines) {
            return $line;
        }

        $fields = json_decode($line, true);

        if (! is_array($fields)) {
            return "\x01".$line;
        }

        $pairs = [];

        foreach ($fields as $key => $configuredField) {
            $pairs[] = $key.'='.(is_scalar($configuredField) ? var_export($configuredField, true) : 'object');
        }

        return implode(' ', $pairs);
    }

    /**
     * @param  list<OutputRecord>  $summaries
     */
    private function checkSummaries(CheckpointBuilder $builder, array $summaries): void
    {
        if ($summaries === [] && $this->contract->summary === SummaryRule::RequiredTerminalRecord) {
            $builder->problemOfWholeOutput(ProblemCode::SummaryMissing, 'The output has no terminal summary.');
        }

        $distinct = array_unique(array_map(fn (OutputRecord $summary) => serialize($summary->captures), $summaries));

        if (count($distinct) > 1) {
            $builder->problemOfWholeOutput(ProblemCode::SummaryConflict, 'The output has summaries that disagree.');
        }
    }

    /**
     * The summary's counts as written; they are never clamped, and a partition that does not add up is a problem.
     *
     * @return array<string, int>
     */
    private function countsOf(CheckpointBuilder $builder, OutputRecord|null $summary): array
    {
        if ($summary === null) {
            return [];
        }

        $counts = [];
        $total = $this->definition->totalField;
        $fields = $total === null ? $this->definition->countFields : [...$this->definition->countFields, $total];

        foreach ($fields as $field) {
            $count = $summary->count($field);

            if ($count !== null) {
                $counts[$field] = $count;
            }
        }

        if ($total !== null && isset($counts[$total])) {
            $parts = array_sum(array_intersect_key($counts, array_flip($this->definition->countFields)));

            if ($parts !== $counts[$total]) {
                $builder->problemOfWholeOutput(
                    ProblemCode::CountsInvalid,
                    'The summary counts do not add up to its total.',
                );
            }
        }

        return $counts;
    }

    private function progressOf(
        CheckpointBuilder $builder,
        ReaderCheckpoint $checkpoint,
        OutputRecord|null $summary,
    ): ReadProgress {
        $records = $checkpoint->recordsOf(RecordRole::Progress);

        if ($records === []) {
            return ReadProgress::none();
        }

        $last = $records[array_key_last($records)];
        $progress = new ReadProgress($last->count('completed') ?? count($records), $last->count('total'));

        if ($progress->isPastItsTotal()) {
            $builder->problemOfWholeOutput(ProblemCode::CountsInvalid, 'Progress counts more steps than its total.');
        }

        $totalField = $this->definition->totalField;

        if ($totalField === null || $summary === null || $progress->total === null) {
            return $progress;
        }

        $summaryTotal = $summary->count($totalField);

        if ($summaryTotal !== null && $progress->total !== $summaryTotal) {
            $builder->problemOfWholeOutput(
                ProblemCode::ProgressTotalStale,
                'The progress total differs from the summary.',
            );
        }

        return $progress;
    }

    /**
     * What the output claims: the summary's failure count where the reader names one, else the last outcome line by
     * the passed or failed group it fills, else success for an empty output the contract allows as one.
     *
     * @param  list<OutputRecord>  $outcomes
     */
    private function claimOf(OutputRecord|null $summary, array $outcomes, bool $isEmpty): ClaimedOutcome
    {
        $field = $this->definition->failureField;

        if ($field !== null && $summary !== null) {
            $failures = $summary->count($field);

            if ($failures !== null) {
                return $failures === 0 ? ClaimedOutcome::Passed : ClaimedOutcome::Failed;
            }
        }

        if ($outcomes !== []) {
            return $outcomes[array_key_last($outcomes)]->claimedOutcome();
        }

        if ($isEmpty && $this->contract->allowsEmptySuccess()) {
            return ClaimedOutcome::Passed;
        }

        return ClaimedOutcome::Unknown;
    }
}
