<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

use App\Accounts\Contracts\SignInProtocol;
use App\Agents\Drivers\Setup\Contracts\AccountFirstRun;
use App\Agents\Drivers\Setup\Contracts\SignInEnvironment;
use App\Agents\Drivers\Setup\Contracts\SignInPreparation;

/**
 * How the sign-in runner invokes a driver, with its executable, environment, model check and
 * sign-out, its sign-in methods (OAuth first) and what a folder needs before a run and after a sign-in.
 */
final readonly class SignInSetup
{
    /**
     * @param  class-string<SignInEnvironment>  $environment
     * @param  non-empty-list<string>  $signOut
     * @param  list<class-string<SignInProtocol>>  $methods  each protocol names its own method, OAuth first
     * @param  list<class-string<SignInPreparation>>  $preparations
     * @param  list<string>  $credentialFiles  the folder's own sign-in files, removed at sign-out
     * @param  list<class-string<AccountFirstRun>>  $firstRuns
     */
    public function __construct(
        public string $executable,
        public string $environment,
        public ModelCheck $modelCheck,
        public array $signOut,
        public array $methods,
        public array $preparations = [],
        public array $credentialFiles = [],
        public array $firstRuns = [],
    ) {}
}
