<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\UsesTemporaryFolder;
use Tests\TestCase;

/**
 * The browser import check: a domain's component may import its own files, @kit, its own generated types and routes
 * and packages; another domain's component, the shell and an import whose path is not written out are refused.
 */
final class DomainImportsTest extends TestCase
{
    use UsesTemporaryFolder;

    private const string ANOTHER_DOMAIN_COMPONENT = "another domain's component (@domain/rules)";

    private const string THE_SHELL = 'the shell (@/)';

    private const string RELATIVE_PATH = 'a relative path leaves the domain';

    private const string UNPROVEN_IMPORT = 'cannot be proven to stay in the domain';

    protected function setUp(): void
    {
        parent::setUp();

        $this->makeTemporaryFolder('domain-imports');
        File::ensureDirectoryExists("{$this->root}/plans/js");
        File::ensureDirectoryExists("{$this->root}/rules/js");
        File::put(
            "{$this->root}/roots.json",
            (string) json_encode(['owners' => ['plans' => 'plans/js', 'rules' => 'rules/js']]),
        );
        File::put("{$this->root}/rules/js/RulesView.vue", "<template><div /></template>\n");
    }

    #[TimeLimit(3, 'It starts the node import check, whose start-up alone can pass a second under load.')]
    public function test_own_kit_generated_and_package_imports_pass(): void
    {
        File::put("{$this->root}/plans/js/Index.vue", <<<'VUE'
            <script setup lang="ts">
            import { ref } from 'vue';
            import Button from '@kit/Button';
            import type { PlanListData } from '@generated/types/plans';
            import { list } from '@generated/routes/plans';
            import PlanCard from './PlanCard.vue';
            </script>
            VUE);

        $this->assertSame(0, $this->check()->getExitCode());
    }

    public function test_another_domains_component_the_shell_and_an_unwritten_path_are_refused(): void
    {
        File::put("{$this->root}/plans/js/Index.vue", <<<'VUE'
            <script setup lang="ts">
            import RulesView from '@domain/rules/RulesView.vue';
            import HomePanes from '@/components/home/HomePanes.vue';
            import Other from '../../rules/js/RulesView.vue';
            const name = 'x';
            const loaded = import(name);
            </script>
            VUE);

        $process = $this->check();

        $this->assertSame(1, $process->getExitCode());
        $this->assertStringContainsString(self::ANOTHER_DOMAIN_COMPONENT, $process->getErrorOutput());
        $this->assertStringContainsString(self::THE_SHELL, $process->getErrorOutput());
        $this->assertStringContainsString(self::RELATIVE_PATH, $process->getErrorOutput());
        $this->assertStringContainsString(self::UNPROVEN_IMPORT, $process->getErrorOutput());
    }

    private function check(): Process
    {
        $process = new Process(
            ['node', base_path('scripts/check-domain-imports.mjs'), "{$this->root}/roots.json", $this->root],
            base_path(),
        );
        $process->run();

        return $process;
    }
}
