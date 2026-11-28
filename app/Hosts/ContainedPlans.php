<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Agents\ContainerManifest;
use App\Agents\Exceptions\ManifestRefused;
use App\Agents\Values\PlanFile;
use App\Models\Hosts\HostProcess;
use App\Support\HelperMounts;
use App\Support\TarArchive;
use App\Support\TarFile;
use App\Values\HostProcessPlan;

/**
 * A contained plan made whole for the host before it opens: its container named for its process, its plan files
 * written by a helper run into the folder its plan file mounts bind, the files folder filled in where the plan names
 * it, and the command as the container runs it, with its resume after a restart, so the host adds nothing.
 */
final readonly class ContainedPlans
{
    /**
     * The placeholder a plan names its files folder by.
     */
    private const string FILES_PLACEHOLDER = '{folder:files}';

    public function __construct(private HelperRuns $runs) {}

    /**
     * @throws ManifestRefused
     */
    public function placed(HostProcessPlan $plan, HostProcess $process): HostProcessPlan
    {
        $container = $plan->container;

        if ($container === null) {
            return $plan;
        }

        $files = array_map(fn (PlanFile $file) => $file->isTemplate ? $this->filled($file) : $file, $plan->files);

        if ($container->mountsPlanFiles()) {
            $session = $process->sessionId() ?? throw ManifestRefused::because(
                "the process {$process->id} mounts plan files but runs for no session",
            );

            $archive = TarArchive::of(...array_map(
                fn (PlanFile $file) => $file->isDriverOnly
                    ? TarFile::privateTo((int) ContainerManifest::DRIVER_USER, $file->name, $file->content)
                    : TarFile::shared($file->name, $file->content),
                $files,
            ));

            $container = $container
                ->withPlanFilesIn(HelperRuns::planFilesFolder($session, $process->id))
                ->preparedBy([$this->runs->planFiles($session, $process->id, $archive)]);
        }

        $argv = array_map($this->filledText(...), $plan->argv);
        $restart = array_map($this->filledText(...), $plan->restartArgv);

        return $plan->asContained(
            $container->named($process->container_name),
            $container->startProfile->commandOf($this->command($argv, $restart, $plan)),
            array_map($this->filledText(...), $plan->environment),
        );
    }

    /**
     * The command, or with a restart command a shell that runs the restart command once its file exists and the
     * command otherwise, so a container its host brings back resumes its process instead of starting it again.
     *
     * @param  list<string>  $argv
     * @param  list<string>  $restart
     * @return list<string>
     */
    private function command(array $argv, array $restart, HostProcessPlan $plan): array
    {
        $when = $plan->restartWhenFile;

        if ($restart === [] || $when === null) {
            return $argv;
        }

        $script = 'if find "$1" -name "$2" -print -quit 2>/dev/null | grep -q .; then exec '
            .$this->quoted($restart).'; fi; exec '.$this->quoted($argv);

        return [
            '/bin/sh',
            '-c',
            $script,
            'journal-session',
            $this->filledText($when->folder),
            $when->glob,
        ];
    }

    /**
     * @param  list<string>  $words
     */
    private function quoted(array $words): string
    {
        return implode(' ', array_map(escapeshellarg(...), $words));
    }

    private function filled(PlanFile $file): PlanFile
    {
        return new PlanFile($file->name, $this->filledText($file->content));
    }

    private function filledText(string $text): string
    {
        return str_replace(self::FILES_PLACEHOLDER, HelperMounts::SESSION_TARGET, $text);
    }
}
