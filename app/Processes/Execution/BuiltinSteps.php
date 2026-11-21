<?php

declare(strict_types=1);

namespace App\Processes\Execution;

use App\Files\Attributes\OutsideThePlaces;
use App\Files\Enums\PlaceExemption;
use App\Processes\Enums\StepType;
use App\Processes\Exceptions\SupervisorRefused;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\ExecutionPlan;
use App\Processes\Values\PlanStep;

/**
 * The builtins the supervisor runs itself, in the shell context rather than as a program: cd, pwd, true, false, :,
 * export, unset, and the plain forms of echo and printf. Unsupported forms are refused before any child starts.
 */
final readonly class BuiltinSteps
{
    /**
     * Refuses a plan whose builtins use a form these adapters do not run, before anything runs.
     *
     * @throws SupervisorRefused
     */
    public function check(ExecutionPlan $plan): void
    {
        foreach ($plan->steps() as $step) {
            if ($step->type === StepType::Builtin) {
                $this->checkStep($step);
            }
        }
    }

    /**
     * @param  list<string>  $arguments
     */
    public function run(string $name, array $arguments, ExecutionContext $context): BuiltinResult
    {
        return match ($name) {
            'cd' => $this->changeFolder($arguments, $context),
            'pwd' => new BuiltinResult(0, $context, $context->workingFolder."\n"),
            'true', ':' => new BuiltinResult(0, $context),
            'false' => new BuiltinResult(1, $context),
            'export' => new BuiltinResult(
                0,
                $context->withEnvironment([...$context->environment, ...$this->assignmentsIn($arguments)]),
            ),
            'unset' => new BuiltinResult(
                0,
                $context->withEnvironment(array_diff_key($context->environment, array_flip($arguments))),
            ),
            'echo' => new BuiltinResult(0, $context, $this->echoed($arguments)),
            'printf' => new BuiltinResult(0, $context, $this->printed(...$arguments)),
            default => throw SupervisorRefused::unsupportedBuiltin($name, 'it has no adapter'),
        };
    }

    private function checkStep(PlanStep $step): void
    {
        $words = array_map(fn ($word) => $word->literal(), $step->argv);
        $name = (string) $words[0];

        if ($name === 'echo' && array_intersect(array_slice($words, 1), ['-e', '-E']) !== []) {
            throw SupervisorRefused::unsupportedBuiltin('echo', 'only -n is run');
        }

        if ($name === 'printf' && count($words) < 2) {
            throw SupervisorRefused::unsupportedBuiltin('printf', 'it needs a format');
        }

        if ($name === 'printf' && preg_match('/%(?![sd%])/', (string) $words[1]) === 1) {
            throw SupervisorRefused::unsupportedBuiltin('printf', 'only %s, %d and %% are run');
        }

        if ($name === 'cd' && count($words) > 2) {
            throw SupervisorRefused::unsupportedBuiltin('cd', 'it takes one folder');
        }
    }

    /**
     * @param  list<string>  $arguments
     */
    #[OutsideThePlaces(PlaceExemption::CommandFileSystem)]
    private function changeFolder(array $arguments, ExecutionContext $context): BuiltinResult
    {
        $target = $arguments[0] ?? ($context->environment['HOME'] ?? $context->workingFolder);
        $folder = realpath(str_starts_with($target, '/') ? $target : rtrim($context->workingFolder, '/').'/'.$target);

        if ($folder === false || ! is_dir($folder)) {
            return new BuiltinResult(1, $context, '', "cd: {$target}: No such file or directory\n");
        }

        return new BuiltinResult(0, $context->withWorkingFolder($folder));
    }

    /**
     * @param  list<string>  $arguments
     * @return array<string, string>
     */
    private function assignmentsIn(array $arguments): array
    {
        $assignments = [];

        foreach ($arguments as $argument) {
            if (! str_contains($argument, '=')) {
                continue;
            }

            [$name, $assignmentText] = explode('=', $argument, 2);
            $assignments[$name] = $assignmentText;
        }

        return $assignments;
    }

    /**
     * @param  list<string>  $arguments
     */
    private function echoed(array $arguments): string
    {
        $newline = ($arguments[0] ?? null) !== '-n';

        return implode(' ', $newline ? $arguments : array_slice($arguments, 1)).($newline ? "\n" : '');
    }

    /**
     * The format applied to its arguments, again for each set of arguments left over, as the shell's printf does.
     */
    private function printed(string $format, string ...$operands): string
    {
        $pattern = strtr($format, ['\\n' => "\n", '\\t' => "\t", '\\\\' => '\\']);
        $arguments = array_values($operands);
        $perPass = max(1, preg_match_all('/%[sd]/', $pattern));
        $output = '';

        do {
            $pass = array_splice($arguments, 0, $perPass);

            $output .= (string) preg_replace_callback('/%([sd%])/', function (array $match) use (&$pass): string {
                return match ($match[1]) {
                    '%' => '%',
                    'd' => (string) (int) (array_shift($pass) ?? 0),
                    default => (string) (array_shift($pass) ?? ''),
                };
            }, $pattern);
        } while ($arguments !== []);

        return $output;
    }
}
