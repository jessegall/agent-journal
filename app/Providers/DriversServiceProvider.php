<?php

declare(strict_types=1);

namespace App\Providers;

use App\Agents\DriverCatalogue;
use App\Agents\Drivers\ClaudeCode\ClaudeAccountSettings;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeAccountHome;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeAdapter;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeArguments;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeChangeEffort;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeChangeModel;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeIsolation;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeJournalServer;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeKeptSignIn;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeLayout;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeMcpTimeouts;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeModelAnswer;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeOwnTerminalHome;
use App\Agents\Drivers\ClaudeCode\ClaudeCodePlatform;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeSettingsFile;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeSignInEnvironment;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeSignInReader;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeSkills;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeTranscriptRestart;
use App\Agents\Drivers\ClaudeCode\ClaudeFirstRun;
use App\Agents\Drivers\ClaudeCode\ClaudeKeySignIn;
use App\Agents\Drivers\ClaudeCode\ClaudeSignIn;
use App\Agents\Drivers\ClaudeCode\ClaudeTokenSignIn;
use App\Agents\Drivers\ClaudeCode\TurnResults;
use App\Agents\Drivers\Codex\CodexAccountSettings;
use App\Agents\Drivers\Codex\CodexAdapter;
use App\Agents\Drivers\Codex\CodexArguments;
use App\Agents\Drivers\Codex\CodexChangeEffort;
use App\Agents\Drivers\Codex\CodexChangeModel;
use App\Agents\Drivers\Codex\CodexFileCredentialStore;
use App\Agents\Drivers\Codex\CodexHome;
use App\Agents\Drivers\Codex\CodexHomeFiles;
use App\Agents\Drivers\Codex\CodexIsolation;
use App\Agents\Drivers\Codex\CodexKeySignIn;
use App\Agents\Drivers\Codex\CodexLayout;
use App\Agents\Drivers\Codex\CodexModelAnswer;
use App\Agents\Drivers\Codex\CodexSignIn;
use App\Agents\Drivers\Codex\CodexSignInEnvironment;
use App\Agents\Drivers\Codex\CodexSignInReader;
use App\Agents\Drivers\Codex\CodexSkills;
use App\Agents\Drivers\Contracts\DriverCatalogue as DriverCatalogueContract;
use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Hooks\HookReplies;
use App\Agents\Drivers\Parts\HostHomeAndPath;
use App\Agents\Drivers\Parts\StatusLineSocket;
use App\Agents\Drivers\Setup\ConditionalPart;
use App\Agents\Drivers\Setup\DefaultDriverSetup;
use App\Agents\Drivers\Setup\DriverImage;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Drivers\Setup\DriverSetup;
use App\Agents\Drivers\Setup\HeadlessTurns;
use App\Agents\Drivers\Setup\ModelCheck;
use App\Agents\Drivers\Setup\SignInSetup;
use App\Agents\Drivers\Setup\VersionLine;
use App\Agents\Drivers\Setup\VersionProbe;
use App\Agents\Drivers\StartConditions\AccountStart;
use App\Agents\Drivers\StartConditions\AccountTerminal;
use App\Agents\Drivers\StartConditions\AccountWithoutFolder;
use App\Agents\Drivers\StartConditions\HostAccountTerminal;
use App\Agents\Drivers\StartConditions\HostHomeStart;
use App\Agents\Drivers\StartConditions\JournalServerAccount;
use App\Agents\Drivers\StartConditions\OwnTerminalStart;
use App\Agents\Exceptions\ProfileRefused;
use App\Agents\SignInEgress;
use App\Files\Contracts\Files;
use App\Processes\AnyContext;
use App\Support\PrivateAccountProcess;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;

/**
 * Holds the one driver registry, with the four default drivers registered in it.
 */
final class DriversServiceProvider extends ServiceProvider
{
    /**
     * How long Codex's model check may take: Codex retries a refused request ten times.
     */
    private const int CODEX_MODEL_CHECK_SECONDS = 90;

    public function register(): void
    {
        $this->app->singleton(DriverCatalogue::class, function (): DriverCatalogue {
            $registry = new DriverCatalogue($this->app);

            foreach (DefaultDrivers::families() as $family) {
                $registry->registerFamily($family);
            }

            foreach (DefaultDrivers::registrations() as $registration) {
                $registry->register($registration);
            }

            return $registry;
        });

        $this->app->alias(DriverCatalogue::class, DriverCatalogueContract::class);

        $this->app->scoped(DriverProfiles::class, fn (Application $app) => new DriverProfiles(
            $app,
            $app->make(DriverCatalogueContract::class),
            $app->make(PinnedBuilds::class),
            $app->make(HookReplies::class),
            $app->make(Files::class),
            $app->make(SignInEgress::class),
            self::setups($app->make('config')),
        ));
    }

    private static function codex(string $signInExecutable): DriverSetup
    {
        $driver = CodexArguments::EXECUTABLE;

        return DefaultDriverSetup::for(DefaultDrivers::CODEX)
            ->driver($driver)
            ->image(DriverImage::at('.docker/drivers/codex'))
            ->arguments(CodexArguments::class)
            ->version(new VersionProbe(
                argv: [$driver, '--version'],
                inherited: HostHomeAndPath::NAMES,
                line: VersionLine::exactly("{$driver}-cli {build}"),
            ))
            ->signInProbe([$driver, 'login', 'status'], CodexSignInReader::class)
            ->layout(CodexLayout::class)
            ->keyScripts([CodexChangeModel::class, CodexChangeEffort::class])
            ->headlessTurns(HeadlessTurns::onAccountOwner([$driver, 'app-server']))
            ->signIn(new SignInSetup(
                executable: $signInExecutable,
                environment: CodexSignInEnvironment::class,
                modelCheck: new ModelCheck(
                    ['exec', '--json', '--skip-git-repo-check', 'Reply with OK.'],
                    CodexModelAnswer::class,
                    self::CODEX_MODEL_CHECK_SECONDS,
                ),
                signOut: ['logout'],
                methods: [CodexSignIn::class, CodexKeySignIn::class],
                preparations: [CodexFileCredentialStore::class],
                credentialFiles: ['auth.json'],
            ))
            ->accountSettings(CodexAccountSettings::class)
            ->skills(CodexSkills::class)
            ->hookAdapter(CodexAdapter::class)
            ->isolation(CodexIsolation::class)
            ->local(
                ConditionalPart::for(new AnyContext(), CodexHome::class),
                ConditionalPart::for(new AnyContext(), HostHomeAndPath::class),
            )
            ->perStart(ConditionalPart::unless(new AccountStart(), CodexHomeFiles::class))
            ->refusedWhen(new OwnTerminalStart(), fn () => ProfileRefused::ownTerminalWithheld($driver))
            // Codex reads its sign-in only from its home, so it has none to check without an account folder.
            ->signInRefusedWhen(
                new AccountWithoutFolder(),
                fn () => ProfileRefused::unresolvedSetting('no account to check the sign-in of'),
            )
            // Codex links its own executable under tmp/arg0 each run; those links never belong in the account folder.
            ->keepsScratchIn('tmp')
            ->build();
    }

    /**
     * What every driver's setup holds before its own differences: the account's folder where a contained start finds
     * it, and the reference an account start reaches the journal by. A fix here lands for every driver.
     */

    /**
     * How the journal starts each driver family it ships.
     *
     * @return list<DriverSetup>
     */
    public static function setups(Repository $config): array
    {
        return [
            self::claudeCode($config->string('journal.accounts.claude_program')),
            self::codex($config->string('journal.accounts.codex_program')),
        ];
    }

    private static function claudeCode(string $signInExecutable): DriverSetup
    {
        $installed = ClaudeCodeArguments::INSTALLED_EXECUTABLE;

        return DefaultDriverSetup::for(DefaultDrivers::CLAUDE_CODE)
            ->driver(ClaudeCodeArguments::EXECUTABLE)
            ->image(DriverImage::at('.docker/drivers/claude-code'))
            ->arguments(ClaudeCodeArguments::class)
            ->version(new VersionProbe(
                argv: [$installed, '--version'],
                inherited: [...ClaudeCodePlatform::NAMES, ...HostHomeAndPath::NAMES],
                line: VersionLine::startingWith('{build} '),
            ))
            ->signInProbe([$installed, 'auth', 'status', '--json'], ClaudeCodeSignInReader::class)
            ->layout(ClaudeCodeLayout::class)
            ->keyScripts([ClaudeCodeChangeModel::class, ClaudeCodeChangeEffort::class])
            ->headlessTurns(HeadlessTurns::eachInAProcess(TurnResults::class))
            ->signIn(self::claudeSignIn($signInExecutable))
            ->accountSettings(ClaudeAccountSettings::class)
            ->skills(ClaudeCodeSkills::class)
            ->hookAdapter(ClaudeCodeAdapter::class)
            ->isolation(ClaudeCodeIsolation::class)
            ->journalServer(ConditionalPart::forAccount(new JournalServerAccount(), ClaudeCodeJournalServer::class))
            ->local(ConditionalPart::forAccount(new AnyContext(), ClaudeCodeAccountHome::class))
            ->perStart(
                ConditionalPart::for(new AnyContext(), ClaudeCodePlatform::class),
                ConditionalPart::for(new HostHomeStart(), HostHomeAndPath::class),
                ConditionalPart::for(new OwnTerminalStart(), ClaudeCodeOwnTerminalHome::class),
                ConditionalPart::for(new JournalServerAccount(), ClaudeCodeMcpTimeouts::class),
                ConditionalPart::for(new AnyContext(), ClaudeCodeSettingsFile::class),
                ConditionalPart::for(new HostAccountTerminal(), StatusLineSocket::class),
                ConditionalPart::for(new OwnTerminalStart(), ClaudeCodeKeptSignIn::class),
                ConditionalPart::forAccount(new AccountTerminal(), ClaudeCodeTranscriptRestart::class),
            )
            ->build();
    }

    private static function claudeSignIn(string $signInExecutable): SignInSetup
    {
        return new SignInSetup(
            executable: $signInExecutable,
            environment: ClaudeCodeSignInEnvironment::class,
            modelCheck: new ModelCheck(
                [
                    '-p',
                    'Reply with OK.',
                    '--output-format',
                    'json',
                    '--max-turns',
                    '1',
                    '--tools',
                    '',
                    '--no-session-persistence',
                ],
                ClaudeCodeModelAnswer::class,
                PrivateAccountProcess::CHECK_SECONDS_LIMIT,
            ),
            signOut: ['auth', 'logout'],
            methods: [ClaudeSignIn::class, ClaudeTokenSignIn::class, ClaudeKeySignIn::class],
            firstRuns: [ClaudeFirstRun::class],
        );
    }
}
