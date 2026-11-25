<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\WordLines;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

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
        'app/Calls/Processes/ProposalList.php',
        'app/Commands/Sharing/ConfigureShareGateway/ConfigureShareGatewayCommand.php',
        'app/Console/Commands/ConfigureShareGatewayCommand.php',
        'app/Console/Commands/SuperviseSharingCommand.php',
        'app/Contracts/Bus/CommandClassifier.php',
        'app/Contracts/Bus/CommandRuleProvider.php',
        'app/Contracts/Processes/ProgramClassifier.php',
        'app/Contracts/Sharing/ShareGateway.php',
        'app/Data/Pages/DeclarationData.php',
        'app/Data/Processes/ExplainedNodeData.php',
        'app/Data/Processes/PartSummaryData.php',
        'app/Declarations/RuleDeclarations.php',
        'app/Enums/Sharing/GatewayAddressCheck.php',
        'app/Enums/Sharing/GatewayOutcome.php',
        'app/Enums/Files/PlaceExemption.php',
        'app/Enums/CommandRules/StepType.php',
        'app/Enums/CommandRules/UnresolvedType.php',
        'app/Exceptions/CommandRuleConflict.php',
        'app/Exceptions/GatewayOpenFailed.php',
        'app/Exceptions/SignInProtocolMissing.php',
        'app/Exceptions/SupervisorInsideTransaction.php',
        'app/Http/Controllers/Calls/ListProposalsController.php',
        'app/Http/Pages/Resolvers/GatewaySettingsResolver.php',
        'app/Models/CommandRules/RuleProposal.php',
        'app/Models/Sharing/ShareGatewayEndpoint.php',
        'app/Models/Sharing/ShareGatewayOperation.php',
        'app/Pipelines/ReadSimpleCommandPipeline.php',
        'app/Providers/ProcessesServiceProvider.php',
        'app/Support/Admission/LineAdmission.php',
        'app/Support/Classification/ChildCommand.php',
        'app/Support/Classification/TreeClassifier.php',
        'app/Support/CommandRuleRegistry.php',
        'app/Support/ExecutableCheck.php',
        'app/Support/Execution/Supervisor.php',
        'app/Support/Explanations.php',
        'app/Support/GatewayEndpoint.php',
        'app/Support/GatewaySettings.php',
        'app/Support/Gateways/Ngrok/NgrokGateway.php',
        'app/Support/Gateways/Support/GatewayChildren.php',
        'app/Support/Gateways/Support/GatewayStarts.php',
        'app/Support/Gateways/Tunler/TunlerGateway.php',
        'app/Support/PackageScripts.php',
        'app/Support/PlanBuilder.php',
        'app/Support/ProgramClassifiers.php',
        'app/Support/ProgramNames.php',
        'app/Support/Rules/BuildRules.php',
        'app/Support/Rules/CheckRules.php',
        'app/Support/Rules/FileRules.php',
        'app/Support/Rules/GitRules.php',
        'app/Support/Rules/JournalClassifier.php',
        'app/Support/Rules/NetworkRules.php',
        'app/Support/Rules/PackageRules.php',
        'app/Support/Rules/ProcessRules.php',
        'app/Support/Rules/ReadingRules.php',
        'app/Support/Rules/ToolRules.php',
        'app/Support/Rules/WrapperRules.php',
        'app/Support/SharingSupervisor.php',
        'app/Support/ShellOperations.php',
        'app/Support/ShellParser.php',
        'app/Support/Stored/StoredCommandRule.php',
        'app/Values/ArgumentGrammar.php',
        'app/Values/Classification.php',
        'app/Values/CommandOperation.php',
        'app/Values/CommandPart.php',
        'app/Values/CommandPattern.php',
        'app/Values/CommandRule.php',
        'app/Values/CommandShape.php',
        'app/Values/ExecutableBinding.php',
        'app/Values/ExecutableVerdict.php',
        'app/Values/ExecutionContext.php',
        'app/Values/PartClassification.php',
        'app/Values/ProgramIdentity.php',
        'app/Values/ProgramSpellings.php',
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
        $found = WordLines::in(WordLines::GO_DRIVER_WORDS, [base_path('tools/journal-agent')]);

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
