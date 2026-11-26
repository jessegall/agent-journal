<?php

declare(strict_types=1);

namespace Tests\Fixtures\Processes;

use App\CommandRules\Enums\CommandClass;
use App\CommandRules\Enums\CommandType;
use App\CommandRules\Enums\EmptySelection;
use App\CommandRules\Enums\FramingType;
use App\CommandRules\Enums\Outcome;
use App\CommandRules\Enums\OutputEncoding;
use App\CommandRules\Enums\StreamUse;
use App\CommandRules\Enums\SummaryRule;
use App\CommandRules\Enums\ToolType;
use App\CommandRules\Values\EmptyRunPolicy;
use App\CommandRules\Values\ExitBranch;
use App\CommandRules\Values\ExitPolicy;
use App\CommandRules\Values\ProgramSpellings;
use App\CommandRules\Values\ProposedRule;
use App\CommandRules\Values\RuleExample;
use App\CommandRules\Values\RuleScope;
use App\Processes\Declarations\VerificationContract;
use App\Processes\Values\ExecutableBinding;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\OutputContract;
use App\Values\ProgressPolicy;
use App\Values\ReaderReference;

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
