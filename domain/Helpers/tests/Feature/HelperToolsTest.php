<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsMcpFrames;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * The helper commands are MCP tools for the main agent (task 422): it discovers all five, a helper neither discovers
 * nor calls them, and a start without a model is refused before any command runs.
 */
#[TimeLimit(6, 'Signed MCP requests page through the whole catalogue.')]
final class HelperToolsTest extends TestCase
{
    use DispatchesHelpers;
    use RefreshHookDatabase;
    use SendsMcpFrames;

    private const array HELPER_TOOLS = [
        'helpers_start',
        'helpers_send',
        'helpers_continue',
        'helpers_steer',
        'helpers_cancel',
    ];

    public function test_the_main_agent_discovers_every_helper_tool(): void
    {
        $tools = $this->catalogue($this->parent);
        $names = array_column($tools, 'name');

        foreach (self::HELPER_TOOLS as $tool) {
            $this->assertContains($tool, $names);
        }

    }

    public function test_a_helper_neither_discovers_nor_calls_the_helper_tools(): void
    {
        $helper = TestStart::start('writing-helper');

        $this->assertSame([], array_intersect(self::HELPER_TOOLS, array_column($this->catalogue($helper), 'name')));
        $this->sendMcp($helper, 'tools/call', [
            'name' => 'helpers_start',
            'arguments' => ['profile_key' => 'plan-reviewer', 'model' => 'default', 'brief' => 'Review it.'],
        ])->assertBadRequest()->assertJsonPath('error.code', -32602);
    }

    public function test_a_start_without_a_model_is_refused_before_any_command_runs(): void
    {
        $this->sendMcp($this->parent, 'tools/call', [
            'name' => 'helpers_start',
            'arguments' => ['profile_key' => 'plan-reviewer', 'brief' => 'Review it.', 'request_key' => 'no-model'],
        ])->assertJsonPath('result.isError', true);

        $this->assertDatabaseCount('command_receipts', 0);
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function catalogue(TestStart $caller): array
    {
        $tools = [];
        $arguments = [];

        do {
            $page = $this->sendMcp($caller, 'tools/list', $arguments)->assertOk()->json('result');
            $tools = [...$tools, ...$page['tools']];
            $arguments = isset($page['nextCursor']) ? ['cursor' => $page['nextCursor']] : [];
        } while ($arguments !== []);

        return $tools;
    }
}
