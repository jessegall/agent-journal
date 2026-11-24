<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Models\Records\Layout;
use App\Values\LayoutShape;
use Domain\Access\Models\User;
use Inertia\Testing\AssertableInertia;
use Tests\Support\ActsAsOwner;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Saved layouts: each user saves, renames, changes and deletes their own, Home lists them by name, and nobody reaches
 * another user's.
 */
final class LayoutsTest extends TestCase
{
    use ActsAsOwner;
    use RefreshHookDatabase;

    private const string LAYOUT_NAME = 'Deep review';

    /**
     * @var array<string, mixed>
     */
    private array $shape = [
        'grid' => [
            'type' => 'pane',
            'id' => 'pane-chat',
            'windows' => ['chat'],
            'active' => 'chat',
            'limitWidth' => false,
        ],
        'detached' => [],
    ];

    public function test_a_saved_layout_returns_to_home_and_is_listed_by_name(): void
    {
        $this->actingAs($this->owner)->from('/?q=release')->post(
            '/layouts',
            ['name' => ' Review ', 'shape' => $this->shape],
        )
            ->assertRedirect('/?q=release')
            ->assertStatus(303);
        $this->actingAs($this->owner)->post('/layouts', ['name' => 'Focus', 'shape' => $this->shape]);

        $this->actingAs($this->owner)->get('/')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.layouts.0.name', 'Focus')
            ->where('page.data.layouts.1.name', 'Review')
            ->where('page.data.layouts.1.shape.grid.windows', ['chat'])
            ->missing('page.data.layoutsView'));
    }

    public function test_a_name_is_used_once_per_user_and_may_not_be_blank(): void
    {
        $this->actingAs($this->owner)->post('/layouts', ['name' => 'Review', 'shape' => $this->shape]);

        $this->actingAs($this->owner)->post(
            '/layouts',
            ['name' => 'Review', 'shape' => $this->shape],
        )->assertSessionHasErrors('name');
        $this->actingAs($this->owner)->post(
            '/layouts',
            ['name' => '  ', 'shape' => $this->shape],
        )->assertSessionHasErrors('name');
        $this->actingAs($this->owner)->post(
            '/layouts',
            ['name' => 'Other', 'shape' => ['grid' => []]],
        )->assertSessionHasErrors(['shape.grid', 'shape.detached']);
        $this->assertSame(1, Layout::query()->count());
    }

    public function test_a_layout_is_renamed_and_changed_under_its_own_name(): void
    {
        $this->actingAs($this->owner)->post('/layouts', ['name' => 'Review', 'shape' => $this->shape]);
        $layout = Layout::query()->sole();
        $changed = [
            ...$this->shape,
            'detached' => [
                ['key' => 'plans', 'left' => 80, 'top' => 80, 'width' => 480, 'height' => 360, 'isMinimised' => false],
            ],
        ];

        $this->actingAs($this->owner)->put(
            "/layouts/{$layout->id}",
            ['name' => 'Review', 'shape' => $changed],
        )->assertSessionHasNoErrors();
        $this->actingAs($this->owner)->put(
            "/layouts/{$layout->id}",
            ['name' => 'Deep review', 'shape' => $changed],
        )->assertSessionHasNoErrors();

        $this->assertSame(self::LAYOUT_NAME, $layout->refresh()->name);
        $this->assertSame('plans', $layout->shape['detached'][0]['key']);
    }

    public function test_another_users_layout_is_neither_listed_nor_reached(): void
    {
        $theirs = Layout::create(User::factory()->create()->id, 'Theirs', LayoutShape::of($this->shape));

        $this->actingAs($this->owner)->get('/')->assertInertia(
            fn (AssertableInertia $page) => $page->where('page.data.layouts', []),
        );
        $this->actingAs($this->owner)->put(
            "/layouts/{$theirs->id}",
            ['name' => 'Mine', 'shape' => $this->shape],
        )->assertNotFound();
        $this->actingAs($this->owner)->delete("/layouts/{$theirs->id}")->assertNotFound();
        $this->actingAs($this->owner)->post(
            '/layouts',
            ['name' => 'Theirs', 'shape' => $this->shape],
        )->assertSessionHasNoErrors();
    }

    public function test_a_deleted_layout_is_gone(): void
    {
        $this->actingAs($this->owner)->post('/layouts', ['name' => 'Review', 'shape' => $this->shape]);

        $this->actingAs($this->owner)->delete('/layouts/'.Layout::query()->sole()->id)->assertStatus(303);

        $this->assertSame(0, Layout::query()->count());
    }
}
