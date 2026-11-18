<?php

declare(strict_types=1);

namespace Tests\Fixtures\Processes;

use App\Processes\Declarations\VerificationContract;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\CommandType;
use App\Processes\Enums\EmptySelection;
use App\Processes\Enums\FramingType;
use App\Processes\Enums\Outcome;
use App\Processes\Enums\OutputEncoding;
use App\Processes\Enums\StreamUse;
use App\Processes\Enums\SummaryRule;
use App\Processes\Enums\ToolType;
use App\Processes\Values\ArgumentGrammar;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandRule;
use App\Processes\Values\EmptyRunPolicy;
use App\Processes\Values\ExecutableBinding;
use App\Processes\Values\ExitBranch;
use App\Processes\Values\ExitPolicy;
use App\Processes\Values\OutputContract;
use App\Processes\Values\ProgramSpellings;
use App\Processes\Values\ProgressPolicy;
use App\Processes\Values\ProposedRule;
use App\Processes\Values\ReaderReference;
use App\Processes\Values\RuleExample;
use App\Processes\Values\RuleScope;

/**
 * The hypothetical acme verify check of doc 21 revision 6, section 72, as a project declaration with its proven exits.
 */
final class AcmeDeclarations
{
    public static function verify(): CommandRule
    {
        $rule = CommandRule::forCheck(
            'project.acme.verify',
            new ProgramSpellings('acme', ['acme-cli']),
            ['verify'],
            ArgumentGrammar::none(),
            CommandClassSet::of(CommandClass::Read),
            CommandType::Verification,
            ToolType::Other,
        )->ownedBy(RuleScope::project(), 1);
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
                ExitBranch::of(0, Outcome::Passed, 'summary.failed == 0'),
                ExitBranch::of(1, Outcome::Findings, 'summary.failed > 0'),
            ),
            ProgressPolicy::indeterminate(),
            ReaderReference::required(),
        );

        return CommandRule::fromArray([...$rule->toArray(), 'contracts' => [$contract->toArray()]]);
    }

    public static function proposedVerify(): ProposedRule
    {
        return self::proposed(self::verify());
    }

    public static function proposed(CommandRule $rule): ProposedRule
    {
        return new ProposedRule($rule, 'acme --help documents verify as read-only', [
            RuleExample::positive('acme verify', CommandClassSet::of(CommandClass::Read)),
            RuleExample::negative('acme verify --fix'),
        ]);
    }
}
