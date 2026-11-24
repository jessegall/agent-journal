<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Component\Finder\Finder;
use Tests\Support\Agents\HostContract;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Each request a page sends, as the frontend tests recorded it from the browser's side under
 * tests/Contracts/page-requests, is sent to the real route as the signed-in owner and passes its validation: a value
 * the page sends that the server refuses, such as an empty one, fails here.
 */
final class PageRequestContractTest extends TestCase
{
    use OpensTerminalRuntimes;
    use RefreshHookDatabase;

    /**
     * The agent every recorded address names, replaced by a real one.
     */
    private const string RECORDED_AGENT = '01JPAGEREQUESTAGENT0000000';

    /**
     * @return iterable<string, array{string}>
     */
    public static function recordedRequests(): iterable
    {
        foreach (Finder::create()->files()->in(dirname(__DIR__, 2).'/Contracts/page-requests')->name('*.json') as $file) {
            yield $file->getBasename('.json') => [$file->getBasename()];
        }
    }

    #[DataProvider('recordedRequests')]
    public function test_a_request_the_page_sends_passes_the_server_validation(string $file): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $agentId = $this->runtimeOn('host-1')->session->agent_id;
        /** @var array{method: string, url: string, body: array<string, mixed>|null} $request */
        $request = HostContract::of("page-requests/{$file}")->read();

        $response = $this->actingAs($owner)->json(
            $request['method'],
            str_replace(self::RECORDED_AGENT, $agentId, $request['url']),
            $request['body'] ?? [],
        );

        $this->assertNotSame(422, $response->status(), (string) $response->getContent());
    }
}
