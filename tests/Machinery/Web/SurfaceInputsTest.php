<?php

declare(strict_types=1);

namespace Tests\Machinery\Web;

use App\Http\Requests\Agents\TerminalFrameRequest;
use App\Reads\PageFormRequests;
use App\Support\ActorReference;
use App\Web\Creation\Exceptions\InvalidSurfaceInput;
use App\Web\Creation\Exceptions\InvalidSurfacePolicy;
use App\Web\Creation\SurfaceAttributeMap;
use App\Web\Creation\SurfaceContexts;
use App\Web\Creation\SurfacePayload;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Illuminate\Validation\ValidationException;
use Tests\Fixtures\Web\Types\BoundedShelfData;
use Tests\Fixtures\Web\Types\ConflictingScheduleData;
use Tests\Fixtures\Web\Types\SurfaceVisitData;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

#[TestsMachinery(SurfaceContexts::class)]
final class SurfaceInputsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_admitted_visit_overwrites_trusted_fields_and_supplies_absent_slot(): void
    {
        $owner = $this->journal->owner()->ownerUser();
        $visit = $this->visit();
        $context = $this->app->make(SurfaceContexts::class)->forVisit($visit);
        $input = SurfaceVisitData::factory()->withoutValidation()->from(new SurfacePayload($context, [
            'actor' => ActorReference::system(),
            'target' => 'submitted',
            'label' => 'submitted',
        ]));

        $this->assertTrue($input->actor->isSameAs(ActorReference::of($owner)));
        $this->assertSame('selected', $input->target);
        $this->assertSame('visit', $input->label);
        $this->assertNull($input->slot);
    }

    public function test_missing_actor_context_fails_before_a_payload_value_can_be_used(): void
    {
        $this->journal->asGuest();
        $context = $this->app->make(SurfaceContexts::class)->forVisit($this->visit());
        $this->expectExceptionObject(InvalidSurfaceInput::missing(SurfaceVisitData::class, 'actor'));

        SurfaceVisitData::from(new SurfacePayload($context, ['actor' => ActorReference::system()]));
    }

    public function test_validation_receives_the_raw_isolated_query_value(): void
    {
        $this->journal->owner();
        $visit = $this->visit();
        $visit->query->set('label', ['wrong']);
        $context = $this->app->make(SurfaceContexts::class)->forVisit($visit);
        $this->expectException(ValidationException::class);

        SurfaceVisitData::factory()->alwaysValidate()->from(new SurfacePayload($context, []));
    }

    public function test_a_numeric_parameter_from_a_bound_route_remains_a_route_key(): void
    {
        $visit = $this->visit();
        $route = $visit->route();
        $this->assertInstanceOf(Route::class, $route);
        $route->setParameter('agent', 42);

        $context = $this->app->make(SurfaceContexts::class)->forVisit($visit);

        $this->assertSame('42', $context->routeKey('agent'));
    }

    public function test_form_request_uses_the_isolated_route_and_query_without_rebinding(): void
    {
        $original = $this->app->make(Request::class);
        $visit = $this->visit();
        $visit->query->set('after', '8');

        $input = $this->app->make(PageFormRequests::class)->forVisit(TerminalFrameRequest::class, $visit);

        $this->assertSame('selected', $input->agentId());
        $this->assertSame(8, $input->heldFrame()->sequence);
        $this->assertSame($original, $this->app->make(Request::class));
    }

    public function test_the_metadata_supplies_the_size_before_reading_and_refuses_an_overrun(): void
    {
        $map = $this->app->make(SurfaceAttributeMap::class);
        $policy = $map->forPage(BoundedShelfData::class);
        $visit = $this->visit();
        $visit->query->set('page', '3');
        $context = $this->app->make(SurfaceContexts::class)->forVisit($visit);

        $this->assertSame(2, $policy->limitFor('books'));
        $this->assertSame(3, $policy->pageNumber($context));
        $this->expectException(InvalidSurfacePolicy::class);

        $policy->assertRows(BoundedShelfData::from([
            'books' => [['title' => 'First'], ['title' => 'Second'], ['title' => 'Third']],
        ]));
    }

    public function test_conflicting_schedules_are_refused_without_creating_the_product(): void
    {
        $this->expectException(InvalidSurfacePolicy::class);

        $this->app->make(SurfaceAttributeMap::class)->forType(ConflictingScheduleData::class);
    }

    private function visit(): Request
    {
        $visit = Request::create('/terminal/selected?label=visit');
        $route = new Route('GET', '/terminal/{agent}', []);
        $route->bind($visit);
        $visit->setRouteResolver(static fn () => $route);

        return $visit;
    }
}
