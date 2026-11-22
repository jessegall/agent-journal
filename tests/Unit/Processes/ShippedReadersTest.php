<?php

declare(strict_types=1);

namespace Tests\Unit\Processes;

use App\Enums\Outcome;
use App\Enums\OutputStream;
use App\Support\DeclarativeReader;
use App\Support\Rules\ShippedReaders;
use App\Values\OutputFrame;
use App\Values\ProofSample;
use App\Values\ReaderCheckpoint;
use App\Values\ShippedReader;
use App\Values\ToolVersions;
use Tests\TestCase;

/**
 * Every shipped reader reads the samples it was proven on: a clean run passes, a run with findings is findings, and
 * an execution error is never read as either; a reader bound to one version is no reader for another (doc 21 revision
 * 6, sections 68 and 71; stories 139 to 143).
 */
final class ShippedReadersTest extends TestCase
{
    public function test_each_sample_reads_as_the_branch_it_proves(): void
    {
        foreach (new ShippedReaders()->all() as $reader) {
            foreach ($reader->samples() as $sample) {
                $this->assertSampleReadsAsItsBranch($reader, $sample);
            }
        }
    }

    public function test_a_reader_is_bound_to_the_version_it_was_proven_on(): void
    {
        $readers = new ShippedReaders();

        $this->assertSame('2.3.6', $readers->forInstalled('phpstan', '2.3.6')?->version);
        $this->assertNull($readers->forInstalled('phpstan', '2.3.7'));
    }

    public function test_every_reader_of_a_locked_tool_is_bound_to_the_version_installed_here(): void
    {
        $installed = ToolVersions::ofProject(base_path());

        foreach (new ShippedReaders()->all() as $reader) {
            if (str_ends_with($reader->versionSource, 'binary')) {
                continue;
            }

            $this->assertTrue($installed->hasInstalled($reader->versionSource, $reader->version), $reader->tool);
        }
    }

    private function assertSampleReadsAsItsBranch(ShippedReader $reader, ProofSample $sample): void
    {
        $read = new DeclarativeReader($reader->reader, $reader->contract, "{$reader->tool}-{$reader->version}");
        $frame = new OutputFrame(OutputStream::Stdout, 0, $reader->outputOf($sample));
        $assessment = $read->finish($read->read(new ReaderCheckpoint(), $frame), $sample->end());
        $outcome = $reader->exits->outcomeOf($sample->exit);
        $accepted = $assessment->problems === [] && $outcome->acceptsClaim($assessment->claimed)
            && $outcome !== Outcome::ExecutionError;
        $name = "{$reader->tool} {$sample->file}";

        if (! $sample->provesABranch()) {
            $this->assertFalse($accepted, $name);

            return;
        }

        $this->assertSame([], array_map(fn ($problem) => $problem->explanation, $assessment->problems));
        $this->assertSame($sample->proves, $outcome->value);
        $this->assertTrue(
            $outcome->acceptsClaim($assessment->claimed),
            $name.'/'.$assessment->claimed->value,
        );
    }
}
