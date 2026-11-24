<?php

declare(strict_types=1);

namespace Tests\Unit\Processes;

use App\Declarations\VerificationContract;
use App\Enums\EmptySelection;
use App\Enums\FramingType;
use App\Enums\Outcome;
use App\Enums\OutputEncoding;
use App\Enums\StreamUse;
use App\Enums\SummaryRule;
use App\Enums\ToolType;
use App\Exceptions\VerificationContractInvalid;
use App\Values\EmptyRunPolicy;
use App\Values\ExecutableBinding;
use App\Values\ExitBranch;
use App\Values\ExitPolicy;
use App\Values\OutputContract;
use App\Values\ProgressPolicy;
use App\Values\ReaderReference;
use PHPUnit\Framework\TestCase;

/**
 * A verification contract is built from validated parts: every exit is listed
 * with its evidence, anything else is an execution error, and a broken field is named.
 */
final class VerificationContractTest extends TestCase
{
    private const string PASSING_EXIT_EVIDENCE = 'summary.failed == 0';

    public function test_the_acme_verify_contract_of_section_72_is_built_and_judges_its_exits(): void
    {
        $contract = new VerificationContract(
            'acme verify',
            ToolType::Other,
            ExecutableBinding::builtin('acme', ['/opt/tools']),
            new OutputContract(
                OutputEncoding::Utf8,
                FramingType::JsonLines,
                '1',
                StreamUse::Separate,
                SummaryRule::RequiredTerminalRecord,
                EmptyRunPolicy::invalid(),
                EmptySelection::ConfigurationProblem,
            ),
            ExitPolicy::of(
                ExitBranch::of(0, Outcome::Passed, self::PASSING_EXIT_EVIDENCE),
                ExitBranch::of(1, Outcome::Findings, 'summary.failed > 0'),
                ExitBranch::of(2, Outcome::ExecutionError, 'diagnostic'),
            ),
            ProgressPolicy::indeterminate(),
            ReaderReference::proven('acme-json:2'),
        );

        $this->assertSame(Outcome::Findings, $contract->exits->outcomeOf(1));
        $this->assertSame(Outcome::ExecutionError, $contract->exits->outcomeOf(3));
        $this->assertContains(
            sprintf('exit %s: %s when %s', 0, Outcome::Passed->value, self::PASSING_EXIT_EVIDENCE),
            $contract->description(),
        );
    }

    public function test_an_unproven_contract_requires_a_reader_and_treats_every_exit_as_an_execution_error(): void
    {
        $contract = VerificationContract::unproven(
            'phpstan analyse',
            ToolType::Phpstan,
            ExecutableBinding::builtin('phpstan', ['/usr/bin']),
        );

        $this->assertSame(Outcome::ExecutionError, $contract->exits->outcomeOf(0));
        $this->assertContains($contract->reader->label(), $contract->description());
    }

    public function test_a_negative_status_is_named(): void
    {
        $this->expectExceptionObject(
            VerificationContractInvalid::field('exits.-1', 'an exit status is a number from 0 to 255'),
        );

        ExitBranch::of(-1, Outcome::Passed, 'summary');
    }

    public function test_a_duplicate_status_is_named(): void
    {
        $this->expectException(VerificationContractInvalid::class);
        $this->expectExceptionMessage('exits');

        ExitPolicy::of(ExitBranch::of(0, Outcome::Passed, 'a'), ExitBranch::of(0, Outcome::Findings, 'b'));
    }

    public function test_an_empty_success_without_its_summary_and_an_exact_total_without_its_listing_are_named(): void
    {
        $this->expectException(VerificationContractInvalid::class);
        $this->expectExceptionMessage('output.empty');

        EmptyRunPolicy::allowedSuccess(' ');
    }

    public function test_an_exact_total_needs_its_listing(): void
    {
        $this->expectException(VerificationContractInvalid::class);
        $this->expectExceptionMessage('progress');

        ProgressPolicy::exactTotal('', 'selection');
    }
}
