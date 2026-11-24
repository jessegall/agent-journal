<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Enums\ChatPermission;
use App\Models\Accounts\Account;
use App\Support\ActorIdentity;
use App\Support\DefaultDrivers;
use App\Values\AccountLabel;
use Carbon\CarbonImmutable;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Commands\CreateGroupChat\CreateGroupChatCommand;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Component\Finder\Finder;
use Tests\Support\Agents\HostContract;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * Each request a page sends, as the frontend tests recorded it from the browser's side or from Inertia's under
 * tests/Contracts/page-requests, is sent with its headers to the real route as the signed-in owner and passes its
 * validation: a value the page sends that the server refuses, such as an empty one, fails here, and so does an address
 * the server does not know. The fixed ids of resources/js/kit/testing/pageRequests.ts become real records first.
 */
final class PageRequestContractTest extends TestCase
{
    use OpensTerminalRuntimes;
    use RefreshHookDatabase;
    use RunsKeyedCommands;
    use StartsAgentRequests;
    use WritesInboxMessages;

    private const string RECORDED_AGENT = '01JPAGEREQUESTAGENT0000000';

    private const string RECORDED_INBOX = '01JPAGEREQUESTINBOX0000000';

    private const string RECORDED_MESSAGE = '01JPAGEREQUESTMESSAGE00000';

    private const string RECORDED_MEMBER = '01JPAGEREQUESTMEMBER000000';

    private const string RECORDED_ACCOUNT = '01JPAGEREQUESTACCOUNT00000';

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
        /** @var array{method: string, url: string, body: array<string, mixed>|null, headers?: array<string, string>} $request */
        $request = HostContract::of("page-requests/{$file}")->readFor($this->recordsFor($owner));

        $response = $this->actingAs($owner)
            ->withHeaders($request['headers'] ?? [])
            ->json($request['method'], $request['url'], $request['body'] ?? []);

        $this->assertNotContains($response->status(), [404, 405, 422], (string) $response->getContent());
    }

    /**
     * Each fixed id a recording names, under the id of the real record made for it: a running agent, a group chat of
     * the owner with a granted member and a message in it, and an account.
     *
     * @return array<string, string>
     */
    private function recordsFor(User $owner): array
    {
        $agentId = $this->runtimeOn('host-1')->session->agent_id;
        $member = User::factory()->create(['name' => 'Bea']);
        EnvironmentUserGrant::create(
            $member,
            null,
            [ChatPermission::ReceiveInvitations],
            ActorIdentity::of($owner),
            CarbonImmutable::now(),
        );
        $this->inboxOf(ActorIdentity::of($member));
        $this->startUserRequestAs($owner->id);
        $inboxId = $this->runOnBus(new CreateGroupChatCommand('Design', [$member->id]));
        $messageId = $this->runOnBus(new PostChatMessageCommand($inboxId, 'Hello', 'recorded-message'));
        $account = Account::create(DefaultDrivers::CLAUDE_CODE, AccountLabel::from('Work'), '/journal/accounts/recorded');

        return [
            $agentId => self::RECORDED_AGENT,
            $inboxId => self::RECORDED_INBOX,
            $messageId => self::RECORDED_MESSAGE,
            (string) $member->id => self::RECORDED_MEMBER,
            $account->id => self::RECORDED_ACCOUNT,
        ];
    }
}
