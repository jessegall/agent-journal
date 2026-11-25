<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Commands\Accounts\PublishSignInChallenge\PublishSignInChallengeCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Enums\Accounts\SignInMethod;
use App\Jobs\SignInDeadline;
use App\Support\EnrolledHost;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A host publishes a sign-in's challenge: it reaches only the owner and no store, and a challenge outside the provider's
 * pages publishes no link while a stranger reads nothing.
 */
#[TimeLimit(seconds: 5, reason: 'It enrolls hosts, sends signed calls and runs a short host process.')]
#[TestsCommand(PublishSignInChallengeCommand::class)]
final class PublishSignInChallengeTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'command_receipts',
        'hosts',
        'users',
    ];

    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        Bus::fake([SignInDeadline::class]);
        $this->root = sys_get_temp_dir().'/sign-in-host-'.bin2hex(random_bytes(4));
        config(['accounts.root' => $this->root]);
    }

    public function test_the_challenge_reaches_only_the_owner_no_store_and_a_typed_code_reaches_the_host_once(): void
    {
        $owner = $this->journal->ownerUser();
        $host = $this->enrollHost();
        $this->actingAs($owner)->withHeader('Idempotency-Key', 'request-1')->post('/accounts/sign-ins', [
            'driver' => 'claude-code',
            'method' => 'oauth',
        ])->assertStatus(303);
        $attemptId = (string) $this->signed($host, '/host/sign-ins/claim')->json('attempt_id');
        $challenge = ['address' => 'https://claude.ai/oauth/authorize?secret-state', 'code' => null];
        $this->signed($host, "/host/sign-ins/{$attemptId}/challenge", $challenge)->assertNoContent();
        $this->notify($host, $attemptId, 'waiting')->assertNoContent();

        $page = $this->actingAs($owner)->get('/accounts?add=1')->assertOk();
        $read = $this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/challenge")->assertOk();
        $this->actingAs($owner)->withHeader('Idempotency-Key', 'answer-1')
            ->post("/accounts/sign-ins/{$attemptId}/code", ['code' => ' 1234 '])->assertStatus(303);

        $this->assertSame(
            $attemptId,
            $page->viewData('page')['props']['page']['data']['root']['children'][1]['children'][1]['native']['props']['attempts'][0]['id'],
        );
        $this->assertStringNotContainsString('secret-state', (string) $page->getContent());
        $this->assertSame('https://claude.ai/oauth/authorize?secret-state', $read->json('address'));
        $this->assertStringContainsString('no-store', (string) $read->headers->get('Cache-Control'));
        $code = "/host/sign-ins/{$attemptId}/code";
        $poll = fn (int $generation) => $this->signed($host, $code, ['generation' => $generation]);
        $poll(0)->assertExactJson(['live' => true, 'code' => '1234']);
        $poll(0)->assertExactJson(['live' => true, 'code' => null]);
        $poll(1)->assertExactJson(['live' => false, 'code' => null]);
        $stranger = $this->journal->createUser('Stranger');
        $this->assertFalse($this->actingAs($stranger)->post("/accounts/sign-ins/{$attemptId}/challenge")->isOk());
    }

    public function test_a_challenge_outside_the_providers_pages_publishes_no_link_and_a_stranger_reads_nothing(): void
    {
        $owner = $this->journal->ownerUser();
        $host = $this->enrollHost();
        $attemptId = $this->begin();
        $this->signed($host, '/host/sign-ins/claim');

        foreach ([
            'https://claude.ai.evil.test/oauth',
            'http://claude.ai/oauth',
            'https://evil.test/claude.ai',
        ] as $address) {
            $this->signed($host, "/host/sign-ins/{$attemptId}/challenge", ['address' => $address, 'code' => null])
                ->assertStatus(422)
                ->assertDontSee($address, false);
        }

        $this->assertNull($this->actingAs($owner)->post("/accounts/sign-ins/{$attemptId}/challenge")->json('address'));
        $challenge = ['address' => 'https://claude.ai/oauth/authorize?state', 'code' => null];
        $this->signed($host, "/host/sign-ins/{$attemptId}/challenge", $challenge)->assertNoContent();
        $stranger = $this->actingAs(
            $this->journal->createUser('Stranger'),
        )->post("/accounts/sign-ins/{$attemptId}/challenge");
        $this->assertFalse($stranger->isOk());
        $this->assertStringNotContainsString('claude.ai', (string) $stranger->getContent());
    }

    private function begin(): string
    {
        $this->journal->actAs('Owner');

        $begin = new BeginSignInCommand('claude-code', SignInMethod::OAuth);
        $started = $this->journal->run($begin, (string) Str::ulid());

        return $started->attemptId;
    }

    /**
     * @param  array<string, string>  $identity
     */
    private function notify(
        EnrolledHost $host,
        string $attemptId,
        string $outcome,
        array $identity = [],
    ): TestResponse {
        $body = ['outcome' => $outcome, 'generation' => 0, ...$identity];

        return $this->signed($host, "/host/sign-ins/{$attemptId}/report", $body);
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function signed(EnrolledHost $host, string $target, array $body = []): TestResponse
    {
        return $this->journal->hostCall($host, 'POST', $target, $body === [] ? '' : (string) json_encode($body));
    }

    private function enrollHost(): EnrolledHost
    {
        return $this->journal->asSystem(new EnrollHostCommand('test host '.Str::random(6), ['/work']));
    }
}
