<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

use App\Agents\SignInEgress;
use App\Agents\Values\SecretHandover;
use App\Agents\Values\SignInFolder;
use App\Agents\Values\SignInReport;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Support\PrivateAccountProcess;
use App\Values\FilePath;
use Illuminate\Contracts\Container\Container;

/**
 * A driver's driver as the sign-in runner runs it in an account folder, from the driver's setup: started, asked its
 * sign-in status by the same command the host's probe runs, asked one short model call, signed out, and its first run
 * settled.
 */
final readonly class SignInDriver
{
    /**
     * @param  list<string>  $statusArguments
     */
    public function __construct(
        private DriverProfile $profile,
        private SignInSetup $setup,
        private array $statusArguments,
        private string $driver,
        private Container $container,
        private Files $files,
        private SignInEgress $egress,
    ) {}

    /**
     * @param  list<string>  $arguments
     */
    public function start(array $arguments, string $directory, SecretHandover $handover): PrivateAccountProcess
    {
        foreach ($this->setup->preparations as $preparation) {
            $this->container->make($preparation)($directory);
        }

        $environment = [
            ...$this->container->make($this->setup->environment)($directory),
            ...$this->egress->variables(),
            ...$handover->variables,
        ];

        $command = [
            $this->driver,
            ...$arguments,
        ];

        return PrivateAccountProcess::start($command, $environment, $directory, $handover->readFiles);
    }

    public function status(string $directory, SecretHandover $handover): SignInReport
    {
        $process = $this->start($this->statusArguments, $directory, $handover);
        $printed = $process->finish();

        return $this->profile->signInReport($printed, $process->exitCode(), $this->folderOf($directory));
    }

    /**
     * What one short model call says against the provider: none when it answers, the provider's refusal when not.
     */
    public function modelRefusal(string $directory, SecretHandover $handover): string|null
    {
        $check = $this->setup->modelCheck;
        $process = $this->start($check->arguments, $directory, $handover);
        // Both drivers read their standard input to the end before they answer.
        $process->closeInput();
        $output = $process->finish($check->secondsLimit);

        return $this->container->make($check->reader)($output, $process->exitCode());
    }

    /**
     * Signs the folder out with the driver's own command and removes the sign-in files it kept.
     */
    public function signOut(string $directory): void
    {
        $this->start($this->setup->signOut, $directory, SecretHandover::none())->finish();

        foreach ($this->setup->credentialFiles as $name) {
            $this->files->delete($this->accountFolder($directory)->child($name));
        }
    }

    public function settleFirstRun(string $directory): void
    {
        foreach ($this->setup->firstRuns as $firstRun) {
            $this->container->make($firstRun)($this->accountFolder($directory));
        }
    }

    private function folderOf(string $directory): SignInFolder
    {
        $folder = $this->accountFolder($directory);

        $holdsSignIn = $this->setup->credentialFiles === []
            || array_any(
                $this->setup->credentialFiles,
                fn (string $name) => $this->files->exists($folder->child($name)),
            );

        return new SignInFolder($directory, $this->files->realPath($folder), $holdsSignIn);
    }

    private function accountFolder(string $directory): FilePath
    {
        return $this->files->pathIn(Place::Accounts, $directory);
    }
}
