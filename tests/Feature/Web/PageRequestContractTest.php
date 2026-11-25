<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Messages\InboxPermission;
use App\Models\Access\EnvironmentUserGrant;
use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use App\Support\Access\AccessSettings;
use App\Support\ActorReference;
use App\Support\DefaultDrivers;
use App\Values\AccountLabel;
use Carbon\CarbonImmutable;
use Domain\Chat\ChatDomain;
use Domain\Chat\Support\PairChats;
use Domain\Questions\Tests\Fixtures\QuestionFixtures;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Component\Finder\Finder;
use Tests\Support\Agents\HostContract;
use Tests\Support\DomainBoot;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RefreshHookDatabase;
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

    private const string RECORDED_AGENT = '01JPAGEREQUESTAGENT0000000';

    private const string RECORDED_INBOX = '01JPAGEREQUESTINBOX0000000';

    private const string RECORDED_MESSAGE = '01JPAGEREQUESTMESSAGE00000';

    private const string RECORDED_MEMBER = '01JPAGEREQUESTMEMBER000000';

    private const string RECORDED_ACCOUNT = '01JPAGEREQUESTACCOUNT00000';

    private const string RECORDED_CANDIDATE = '01JPAGEREQUESTCANDIDATE000';

    private const string RECORDED_QUESTION = '01JPAGEREQUESTQUESTION0000';

    private const string RECORDED_ATTEMPT = '01JPAGEREQUESTATTEMPT00000';

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    private User $member;

    /**
     * @return iterable<string, array{string}>
     */
    public static function recordedRequests(): iterable
    {
        foreach (Finder::create()->files()->in(
            dirname(__DIR__, 2).'/Contracts/page-requests',
        )->name('*.json') as $file) {
            yield $file->getBasename('.json') => [$file->getBasename()];
        }
    }

    #[DataProvider('recordedRequests')]
    public function test_a_request_the_page_sends_passes_the_server_validation(string $file): void
    {
        $owner = $this->journal->owner()->ownerUser();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        /** @var array{method: string, url: string, body: array<string, mixed>|null, headers?: array<string, string>, as?: string} $request */
        $request = HostContract::of("page-requests/{$file}")->readFor($this->recordsFor($owner));
        $sender = ($request['as'] ?? null) === 'member' ? $this->member : $owner;

        $response = $this->actingAs($sender)
            ->withHeaders($request['headers'] ?? [])
            ->json($request['method'], $request['url'], $request['body'] ?? []);

        $this->assertNotContains($response->status(), [404, 405, 422], (string) $response->getContent());
    }

    /**
     * Each fixed id a recording names, under the id of the real record made for it: a running agent, a group chat of
     * the owner with a granted member and a message in it, a user who may be added, a question asked of the owner, an
     * account and a sign-in of it.
     *
     * @return array<string, string>
     */
    private function recordsFor(User $owner): array
    {
        $agentId = $this->runtimeOn('host-1')->session->agent_id;
        $member = $this->journal->createUser('Bea');
        $candidate = $this->journal->createUser('Cy');

        foreach ([$member, $candidate] as $invited) {
            EnvironmentUserGrant::create(
                $invited,
                null,
                [InboxPermission::ReceiveInvitations],
                ActorReference::of($owner),
                CarbonImmutable::now(),
            );
        }

        $this->member = $member;
        $this->journal->inboxes()->personal(ActorReference::of($member));
        $this->journal->actAsUserId($owner->id);
        $inboxId = $this->app->make(PairChats::class)->openGroup('Design', [ActorReference::of($member)]);
        $messageId = $this->journal->run(new SendMessageCommand($inboxId, 'Hello'));
        $account = Account::create(
            DefaultDrivers::CLAUDE_CODE,
            AccountLabel::from('Work'),
            '/journal/accounts/recorded',
        );
        $question = $this->journal->fixtures(QuestionFixtures::class)
            ->createQuestion(
                'Plan order',
                $this->journal->inboxes()->personal(ActorReference::of($owner)),
                'Owner',
                'Owner',
                'Which plan first?',
            );
        $attempt = SignInAttempt::create(
            ActorReference::of($owner),
            $account,
            SignInMethod::OAuth,
            '/journal/accounts/staging-recorded',
            CarbonImmutable::now()->addMinutes(10),
        );

        return [
            $agentId => self::RECORDED_AGENT,
            $inboxId => self::RECORDED_INBOX,
            $messageId => self::RECORDED_MESSAGE,
            (string) $member->id => self::RECORDED_MEMBER,
            $account->id => self::RECORDED_ACCOUNT,
            (string) $candidate->id => self::RECORDED_CANDIDATE,
            $question->id => self::RECORDED_QUESTION,
            $attempt->id => self::RECORDED_ATTEMPT,
        ];
    }
}
