<?php

declare(strict_types=1);

namespace Tests\Fixtures\Processes;

use App\Declarations\VerificationContract;
use App\Enums\CommandClass;
use App\Enums\CommandType;
use App\Enums\EmptySelection;
use App\Enums\FramingType;
use App\Enums\Outcome;
use App\Enums\OutputEncoding;
use App\Enums\StreamUse;
use App\Enums\SummaryRule;
use App\Enums\ToolType;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\EmptyRunPolicy;
use App\Values\ExecutableBinding;
use App\Values\ExitBranch;
use App\Values\ExitPolicy;
use App\Values\OutputContract;
use App\Values\ProgramSpellings;
use App\Values\ProgressPolicy;
use App\Values\ProposedRule;
use App\Values\ReaderReference;
use App\Values\RuleExample;
use App\Values\RuleScope;

/**
 * The hypothetical acme verify check as a project declaration with its proven exits.
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

        return CommandRule::from([...$rule->toArray(), 'contracts' => [$contract->toArray()]]);
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
