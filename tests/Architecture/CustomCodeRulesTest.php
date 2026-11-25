<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * The project's own code rules still run and still find exactly what their samples mark: the tool proves every rule
 * on its samples in one run, so a rule broken by a change of the tool or the code fails here instead of going quiet.
 */
final class CustomCodeRulesTest extends TestCase
{
    private const string RULES = '.commandments/custom';

    private const string CONFIG = '.commandments/config.json';

    private const string PLUGIN = '.journal/plugins/code-commandments';

    /**
     * Custom rules switched off in the config, each with the reason it is off.
     *
     * @var array<string, string>
     */
    private const array RULES_OFF = [];

    #[TimeLimit(seconds: 120, reason: 'It runs the commandments engine on the samples of every custom rule.')]
    public function test_every_custom_rule_runs_and_flags_exactly_what_its_samples_mark(): void
    {
        $proof = new Process(
            [PHP_BINARY, self::PLUGIN.'/bin/commandments', 'rule', 'prove'],
            base_path(),
            ['COMMANDMENTS_RELEASE' => 'v'.$this->installedVersion()],
            timeout: 300,
        );
        $proof->run();
        $output = $proof->getOutput().$proof->getErrorOutput();
        $notProved = array_values(array_filter(
            $this->ruleNames(),
            fn (string $rule) => preg_match('/^✓ '.preg_quote($rule, '/').'$/m', $output) !== 1,
        ));

        $this->assertSame([0, []], [$proof->getExitCode(), $notProved]);
    }

    public function test_no_custom_rule_is_switched_off_without_a_reason(): void
    {
        $config = json_decode((string) file_get_contents(base_path(self::CONFIG)), true, flags: JSON_THROW_ON_ERROR);
        $off = array_map(
            fn (string $detector) => basename($detector),
            $config['disable']['detectors'] ?? [],
        );

        $this->assertSame([], array_values(array_diff(
            array_intersect($off, $this->ruleNames()),
            array_keys(self::RULES_OFF),
        )));
    }

    /**
     * @return list<string>
     */
    private function ruleNames(): array
    {
        $files = glob(base_path(self::RULES).'/{,*/}*.json', GLOB_BRACE) ?: [];

        return array_map(fn (string $file) => basename($file, '.json'), $files);
    }

    private function installedVersion(): string
    {
        $manifest = json_decode(
            (string) file_get_contents(base_path(self::PLUGIN.'/journal-plugin.json')),
            true,
            flags: JSON_THROW_ON_ERROR,
        );

        return $manifest['version'];
    }
}
