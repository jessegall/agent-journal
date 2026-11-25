<?php

declare(strict_types=1);

namespace Tests\Reads;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Files\Files;
use App\Enums\Files\Permissions;
use App\Enums\Files\Place;
use App\Support\InstallationFaults;
use App\Support\Web\AppContext;
use App\Values\FilePath;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Session\Store;
use Illuminate\Support\Facades\Process;
use Inertia\AlwaysProp;
use Inertia\DeferProp;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\TestCase;

/**
 * The app context each viewer gets: a guest the installation's name and version, the owner its faults, the navigation
 * and its counts deferred, an inbox member the navigation alone, and the refusal code of the last form once.
 */
#[TestsRead(AppContext::class)]
final class AppContextTest extends TestCase
{
    private const string FAULT = 'The updater could not restart the queue.';

    protected function setUp(): void
    {
        parent::setUp();

        Process::fake(['*' => Process::result("0123456789abcdef0123456789abcdef01234567\n")]);
        $faults = FilePath::in(Place::Temporary, 'app-context-test/faults');
        $files = $this->app->make(Files::class);

        if (! $files->isFolder($faults->parent())) {
            $files->makeFolder($faults->parent(), Permissions::Shared);
        }

        $files->write($faults, self::FAULT."\n");
        $this->app->instance(InstallationFaults::class, new InstallationFaults($files, $faults));
    }

    public function test_a_guest_sees_the_installation_and_is_named_by_type_alone(): void
    {
        $this->journal->asGuest();

        $props = $this->props();

        $this->assertSame('guest', $this->resolved($props['viewer'])['type']);
        $this->assertSame(['type', 'canShare'], array_keys($this->resolved($props['viewer'])));
        $this->assertFalse($this->resolved($props['viewer'])['canShare']);
        $this->assertSame('012345678', $this->resolved($props['installation'])['version']);
        $this->assertSame([], $this->resolved($props['installation'])['faults']);
        $this->assertArrayNotHasKey('navigation', $props);
        $this->assertArrayNotHasKey('navigationCounts', $props);
    }

    public function test_the_owner_sees_the_faults_the_navigation_and_its_counts_deferred(): void
    {
        $this->journal->owner();

        $props = $this->props();
        $viewer = $this->resolved($props['viewer']);

        $this->assertInstanceOf(AlwaysProp::class, $props['viewer']);
        $this->assertSame('owner', $viewer['type']);
        $this->assertSame($this->journal->ownerUser()->id, $viewer['id']);
        $this->assertSame([self::FAULT], $this->resolved($props['installation'])['faults']);
        $this->assertInstanceOf(Closure::class, $props['navigation']);
        $this->assertInstanceOf(DeferProp::class, $props['navigationCounts']);
        $this->assertSame('navigation-counts', $props['navigationCounts']->group());
    }

    public function test_an_inbox_member_sees_no_faults_and_no_counts(): void
    {
        $this->journal->owner()->user('Sam')->admitInboxMember('Sam')->actAsInboxMember('Sam');

        $props = $this->props();

        $this->assertSame('inbox-member', $this->resolved($props['viewer'])['type']);
        $this->assertSame([], $this->resolved($props['installation'])['faults']);
        $this->assertInstanceOf(Closure::class, $props['navigation']);
        $this->assertArrayNotHasKey('navigationCounts', $props);
    }

    public function test_the_refusal_code_of_the_last_form_is_shown_on_the_next_page_alone(): void
    {
        $this->journal->owner();
        $session = $this->session();
        $session->flash(CommandRefusal::CODE_FLASH_KEY, 'quota-reached');

        $this->assertSame('quota-reached', $this->props()['refusalCode']);

        $session->ageFlashData();
        $session->ageFlashData();

        $this->assertArrayNotHasKey('refusalCode', $this->props());
    }

    public function test_two_viewers_one_after_the_other_in_one_worker_each_see_their_own(): void
    {
        $context = $this->app->make(AppContext::class);
        $this->journal->owner()->user('Sam')->admitInboxMember('Sam');

        $ownerProps = $context->data($this->request())->toArray();
        $this->journal->actAsInboxMember('Sam');
        $memberProps = $context->data($this->request())->toArray();

        $this->assertSame('owner', $this->resolved($ownerProps['viewer'])['type']);
        $this->assertSame('inbox-member', $this->resolved($memberProps['viewer'])['type']);
        $this->assertSame($this->journal->userCalled('Sam')->id, $this->resolved($memberProps['viewer'])['id']);
    }

    public function test_the_installation_is_read_only_when_its_prop_is_resolved(): void
    {
        $this->journal->owner();

        $props = $this->props();

        Process::assertNothingRan();
        $this->assertInstanceOf(Closure::class, $props['installation']);
        $this->resolved($props['installation']);
        Process::assertRan(fn () => true);
    }

    /**
     * @return array<string, mixed>
     */
    private function props(): array
    {
        return $this->app->make(AppContext::class)->data($this->request())->toArray();
    }

    private function request(): Request
    {
        $request = Request::create('/');
        $request->setLaravelSession($this->session());

        return $request;
    }

    private function session(): Store
    {
        return $this->app->make('session.store');
    }

    /**
     * The value Inertia sends for a prop: an always prop or a closure is called, and a Data becomes its array.
     *
     * @return array<string, mixed>
     */
    private function resolved(mixed $prop): array
    {
        $value = $prop instanceof AlwaysProp || $prop instanceof Closure ? $prop() : $prop;

        return $value->toArray();
    }
}
