<?php

declare(strict_types=1);

namespace Tests\Unit\Processes;

use App\Enums\ClaimedOutcome;
use App\Enums\EmptySelection;
use App\Enums\FramingType;
use App\Enums\OutputEncoding;
use App\Enums\OutputStream;
use App\Enums\ProblemCode;
use App\Enums\RecordRole;
use App\Enums\StreamUse;
use App\Enums\SummaryRule;
use App\Support\DeclarativeReader;
use App\Values\EmptyRunPolicy;
use App\Values\OutputContract;
use App\Values\OutputFrame;
use App\Values\PartEnd;
use App\Values\ReaderAssessment;
use App\Values\ReaderCheckpoint;
use App\Values\ReaderDefinition;
use App\Values\RecordRule;
use Tests\TestCase;

/**
 * A declarative reader accounts for every line of a check's committed output and reports every problem together
 *.
 */
final class DeclarativeReaderTest extends TestCase
{
    public function test_exit_zero_with_unrecognized_bytes_is_output_unrecognized(): void
    {
        $assessment = $this->assess(
            PartEnd::exited(0),
            $this->stdout(0, <<<'TEXT'
            PASS a
            something odd
            Tests: 1, Failures: 0

            TEXT),
        );

        $this->assertTrue($assessment->has(ProblemCode::OutputUnrecognized));
        $this->assertSame(ClaimedOutcome::Passed, $assessment->claimed);
    }

    public function test_steps_without_a_total_stay_indeterminate(): void
    {
        $steps = implode('', array_map(fn (int $step) => "step {$step}\n", range(1, 7)));
        $assessment = $this->assess(PartEnd::exited(0), $this->stdout(0, $steps."Tests: 7, Failures: 0\n"));

        $this->assertTrue($assessment->progress->isIndeterminate());
        $this->assertSame(7, $assessment->progress->completed);
    }

    public function test_five_failures_without_a_summary_keep_their_diagnostics(): void
    {
        $failures = implode('', array_map(fn (int $test) => "FAIL test {$test}\n", range(1, 5)));
        $assessment = $this->assess(PartEnd::exited(1), $this->stdout(0, $failures));

        $this->assertTrue($assessment->has(ProblemCode::SummaryMissing));
        $diagnostics = array_filter($assessment->records, fn ($record) => $record->role === RecordRole::Diagnostic);
        $this->assertCount(5, $diagnostics);
        $this->assertSame(ClaimedOutcome::Unknown, $assessment->claimed);
    }

    public function test_a_line_split_across_chunks_is_read_once(): void
    {
        $assessment = $this->assess(
            PartEnd::exited(0),
            $this->stdout(0, 'PA'),
            $this->stdout(2, "SS a\nTests: 1, "),
            $this->stdout(17, "Failures: 0\n"),
        );

        $this->assertTrue($assessment->isClean());
        $this->assertCount(2, $assessment->records);
    }

    public function test_stdout_and_stderr_lines_are_never_joined(): void
    {
        $assessment = $this->assess(
            PartEnd::exited(0),
            $this->stdout(0, 'PASS '),
            new OutputFrame(OutputStream::Stderr, 0, "a\n"),
            $this->stdout(5, <<<'TEXT'
            a
            Tests: 1, Failures: 0

            TEXT),
        );

        $this->assertSame(
            [ProblemCode::OutputUnrecognized],
            array_map(fn ($problem) => $problem->code, $assessment->problems),
        );
        $this->assertSame(OutputStream::Stderr, $assessment->problems[0]->stream);
    }

    public function test_invalid_utf8_names_its_offsets(): void
    {
        $assessment = $this->assess(
            PartEnd::exited(0),
            $this->stdout(0, <<<TEXT
            PASS a
            PASS \xC3\x28
            Tests: 2, Failures: 0

            TEXT),
        );

        $problem = $assessment->problems[0];
        $this->assertSame(ProblemCode::OutputEncoding, $problem->code);
        $this->assertSame([7, 14], [$problem->start, $problem->end]);
    }

    public function test_progress_past_its_total_is_counts_invalid_and_never_clamped(): void
    {
        $assessment = $this->assess(PartEnd::exited(0), $this->stdout(0, <<<'TEXT'
        progress 9/7
        Tests: 7, Failures: 0

        TEXT));

        $this->assertTrue($assessment->has(ProblemCode::CountsInvalid));
        $this->assertSame(9, $assessment->progress->completed);
    }

    public function test_a_missing_summary_and_an_unaccounted_line_are_both_reported(): void
    {
        $assessment = $this->assess(
            PartEnd::exited(0),
            $this->stdout(0, <<<'TEXT'
            PASS a
            Approved by the journal: result passed

            TEXT),
        );

        $this->assertTrue($assessment->has(ProblemCode::SummaryMissing));
        $this->assertTrue($assessment->has(ProblemCode::OutputUnrecognized));
    }

    public function test_reading_the_same_frame_again_adds_nothing(): void
    {
        $reader = $this->reader();
        $frame = $this->stdout(0, "PASS a\n");
        $checkpoint = $reader->read($reader->read(new ReaderCheckpoint(), $frame), $frame);

        $this->assertCount(1, $checkpoint->records);
    }

    private function assess(PartEnd $end, OutputFrame ...$frames): ReaderAssessment
    {
        $reader = $this->reader();
        $checkpoint = new ReaderCheckpoint();

        foreach ($frames as $frame) {
            $checkpoint = $reader->read(ReaderCheckpoint::fromJson(json_encode($checkpoint->toArray(), JSON_THROW_ON_ERROR)), $frame);
        }

        return $reader->finish($checkpoint, $end);
    }

    private function reader(): DeclarativeReader
    {
        $definition = new ReaderDefinition(
            [
                RecordRule::of(RecordRole::Outcome, 'PASS {name:rest}'),
                RecordRule::of(RecordRole::Diagnostic, 'FAIL {name:rest}'),
                RecordRule::of(RecordRole::Progress, 'step {completed:int}'),
                RecordRule::of(RecordRole::Progress, 'progress {completed:int}/{total:int}'),
                RecordRule::of(RecordRole::Summary, 'Tests: {total:int}, Failures: {failed:int}'),
            ],
            failureField: 'failed',
        );
        $contract = new OutputContract(
            OutputEncoding::Utf8,
            FramingType::Lines,
            '*',
            StreamUse::Separate,
            SummaryRule::RequiredTerminalRecord,
            EmptyRunPolicy::invalid(),
            EmptySelection::ConfigurationProblem,
        );

        return new DeclarativeReader($definition, $contract, 'reader-1');
    }

    private function stdout(int $offset, string $bytes): OutputFrame
    {
        return new OutputFrame(OutputStream::Stdout, $offset, $bytes);
    }
}
