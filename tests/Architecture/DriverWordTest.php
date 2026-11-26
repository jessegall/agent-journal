<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\WordLines;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Claude Code, Codex and the like are drivers, so no name or text calls one a program. Program keeps its
 * own meaning only where it is an operating-system executable: the command classifier (Processes and Shell), the
 * sharing gateways' binaries, a shell part's program and the sign-in executable.
 */
#[TimeLimit(seconds: 15, reason: 'It reads every line of the code it judges.')]
final class DriverWordTest extends TestCase
{
    private const string HOW_TO_FIX = 'Say driver, not program, for Claude Code, Codex and the like.';

    private const string HOW_TO_FIX_IN_GO = 'Say driver, not program, for Claude Code and Codex in the Go host.';

    private const string GO_PROGRAM_CALL = 'name := profile.Program()';

    private const string GO_PROGRAM_COMMENT = '// Package profiles holds each agent program.';

    private const string GO_EXECUTABLE_CALL = 'program, err := os.Executable()';

    /**
     * The files where program means an operating-system executable: the command classifier and its rules, the shell, the
     * sharing gateways' binaries, a shell part's program and the sign-in executable.
     */
    private const array EXECUTABLE_SENSE = [
        'app/Api/Processes/ProposalList.php',
        'domain/Sharing/src/Commands/ConfigureShareGateway/ConfigureShareGatewayCommand.php',
        'domain/Sharing/src/Console/Commands/ConfigureShareGatewayCommand.php',
        'domain/Sharing/src/Console/Commands/SuperviseSharingCommand.php',
        'app/Bus/Contracts/CommandClassifier.php',
        'app/Bus/Contracts/CommandRuleProvider.php',
        'app/Processes/Contracts/ProgramClassifier.php',
        'domain/Sharing/src/Contracts/ShareGateway.php',
        'app/Profiles/Data/Pages/DeclarationData.php',
        'app/Processes/Data/ExplainedNodeData.php',
        'app/Processes/Data/PartSummaryData.php',
        'app/CommandRules/Declarations/RuleDeclarations.php',
        'domain/Sharing/src/Enums/GatewayAddressCheck.php',
        'domain/Sharing/src/Enums/GatewayOutcome.php',
        'app/Files/Enums/PlaceExemption.php',
        'app/CommandRules/Enums/StepType.php',
        'app/CommandRules/Enums/UnresolvedType.php',
        'app/Exceptions/CommandRuleConflict.php',
        'domain/Sharing/src/Exceptions/GatewayOpenFailed.php',
        'app/Exceptions/SignInProtocolMissing.php',
        'app/Exceptions/SupervisorInsideTransaction.php',
        'app/Http/Controllers/Api/ListProposalsController.php',
        'domain/Sharing/src/Http/Pages/Resolvers/GatewaySettingsResolver.php',
        'app/Models/CommandRules/RuleProposal.php',
        'domain/Sharing/src/Models/ShareGatewayEndpoint.php',
        'domain/Sharing/src/Models/ShareGatewayOperation.php',
        'app/Processes/Grammar/Pipelines/ReadSimpleCommandPipeline.php',
        'app/Providers/ProcessesServiceProvider.php',
        'app/Access/ShellAdmission.php',
        'app/Support/Classification/ChildCommand.php',
        'app/Support/Classification/CommandClassifier.php',
        'app/CommandRules/CommandRuleRegistry.php',
        'app/Processes/ExecutableCheck.php',
        'app/Processes/Explanations.php',
        'domain/Sharing/src/Support/Gateways/GatewayEndpoint.php',
        'domain/Sharing/src/Support/Gateways/GatewaySettings.php',
        'domain/Sharing/src/Support/Gateways/NgrokGateway.php',
        'domain/Sharing/src/Support/Gateways/GatewayChildren.php',
        'domain/Sharing/src/Support/Gateways/GatewayStarts.php',
        'domain/Sharing/src/Support/Gateways/TunlerGateway.php',
        'app/CommandRules/PackageScripts.php',
        'app/Processes/PlanBuilder.php',
        'app/CommandRules/ProgramClassifiers.php',
        'app/CommandRules/ProgramNames.php',
        'app/Support/Rules/BuildRules.php',
        'app/Support/Rules/CheckRules.php',
        'app/Support/Rules/FileRules.php',
        'app/Support/Rules/GitRules.php',
        'app/Support/Rules/ProgramClassifier.php',
        'app/Support/Rules/NetworkRules.php',
        'app/Support/Rules/PackageRules.php',
        'app/Support/Rules/ProcessRules.php',
        'app/Support/Rules/ReadingRules.php',
        'app/Support/Rules/ToolRules.php',
        'app/Support/Rules/WrapperRules.php',
        'domain/Sharing/src/Support/SharingSupervisor.php',
        'app/Processes/ShellOperations.php',
        'app/Processes/ShellCommandParser.php',
        'app/Values/ArgumentGrammar.php',
        'app/Values/Classification.php',
        'app/Values/CommandOperation.php',
        'app/Agents/Values/CommandPart.php',
        'app/Values/CommandPattern.php',
        'app/Values/CommandRule.php',
        'app/Values/CommandShape.php',
        'app/Processes/Values/ExecutableBinding.php',
        'app/Processes/Values/ExecutableVerdict.php',
        'app/Values/ExecutionContext.php',
        'app/Values/PartClassification.php',
        'app/Processes/Values/ProgramIdentity.php',
        'app/CommandRules/Values/ProgramSpellings.php',
        'app/Values/WrapperRule.php',
        'resources/js/sharing/pages/sharing/GatewayConfigureForm.vue',
    ];

    /**
     * Lines elsewhere that name the command classifier's program types or a driver's executable path setting.
     */
    private const string EXECUTABLE_LINE = '/Program(Classifier|Spellings|Identity)\b|accounts\\.(claude|codex)_program/';

    public function test_no_code_calls_a_driver_a_program(): void
    {
        $folders = [
            app_path(),
            ...DomainFiles::domainCode(),
            resource_path('js'),
            ...(glob(base_path('domain/*/resources/js'), GLOB_ONLYDIR) ?: []),
        ];

        $found = array_values(array_filter(
            WordLines::in(WordLines::DRIVER_WORDS, $folders),
            fn (string $line): bool => ! in_array(self::relativePath($line), self::EXECUTABLE_SENSE, true)
                && preg_match(self::EXECUTABLE_LINE, self::text($line)) !== 1,
        ));

        $this->assertSame([], $found, self::HOW_TO_FIX);
    }

    public function test_the_go_host_calls_a_driver_a_driver(): void
    {
        $found = WordLines::in(WordLines::GO_DRIVER_WORDS, [base_path('programs/agent')]);

        $this->assertSame([], $found, self::HOW_TO_FIX_IN_GO);
    }

    public function test_the_go_check_catches_a_driver_called_a_program(): void
    {
        $this->assertMatchesRegularExpression(WordLines::GO_DRIVER_WORDS, self::GO_PROGRAM_CALL);
        $this->assertMatchesRegularExpression(WordLines::GO_DRIVER_WORDS, self::GO_PROGRAM_COMMENT);
        $this->assertDoesNotMatchRegularExpression(WordLines::GO_DRIVER_WORDS, self::GO_EXECUTABLE_CALL);
    }

    /**
     * The text of the line a `path:line` names.
     */
    private static function relativePath(string $line): string
    {
        return substr(explode(':', $line)[0], strlen(base_path()) + 1);
    }

    private static function text(string $line): string
    {
        [$path, $number] = explode(':', $line);

        return (file($path, FILE_IGNORE_NEW_LINES) ?: [])[(int) $number - 1] ?? '';
    }
}
