# Pipelines

How a pipeline is declared, how its pipes are written and how every pipeline is checked (users 29250 to 29274).

## A pipeline

A pipeline is a class that implements `App\Bus\Contracts\PipelineDefinition`. It declares the type it takes, the type
it hands out and its steps in order. It lives in a `Pipelines` folder of core or of a domain.

```php
/**
 * @implements PipelineDefinition<HookCallStage, DriverReply>
 */
final readonly class AnswerHookPipeline implements PipelineDefinition
{
    public string $input = HookCallStage::class;

    public string $output = DriverReply::class;

    public function pipes(): array
    {
        return [
            LockStack::class,
            FindReplay::class,
            WalkStack::class,
            Step::conditional(
                fn (WalkedCall $walked) => $walked->leavesMessagesWithIdleAgent(),
                then: KeepMessagesAndWake::class,
                else: HandOverWaitingMessages::class,
            ),
            SaveCall::class,
        ];
    }
}
```

Run one with `PipelineRunner::run(AnswerHookPipeline::class, $input, DriverReply::class)`. The runner refuses a
value the pipeline does not take before the first step, and an output of another type after the last step.

## Pipes

A pipe implements `App\Bus\Contracts\Pipe`. Its `handle` method comes in four forms, and the runner reads which one from
the signature.

- The first parameter picks what the pipe gets: the carried value, typed, or the `PipelineContext`.
- An optional second parameter, `Closure $next`, picks who runs the rest of the pipeline.

The runner wraps every pipe into one shape, `(carried, next) => output`.

### 1. The value (most pipes)

The pipe takes the carried value and returns the value to carry on. The runner runs the rest of the pipeline on what it
returns.

```php
final readonly class WalkStack implements Pipe
{
    public function handle(RestoredCall $restored): WalkedCall
    {
        return new WalkedCall(/* ... */);
    }
}
```

### 2. The value and next

The pipe takes the carried value and the rest of the pipeline. It decides whether the rest runs, and it returns the
pipeline's output: what `$next` returned, or its own answer.

```php
final readonly class FindReplay implements Pipe
{
    /**
     * @param  Closure(LockedCall): DriverReply  $next
     */
    public function handle(LockedCall $locked, Closure $next): DriverReply
    {
        $recorded = HookCall::query()->forHookId($locked->call->identity->hookId)->first();

        if ($recorded === null) {
            return $next($locked);
        }

        return DriverReply::fromRecorded($recorded->answer);
    }
}
```

### 3. The context

The pipe does not need the value's type. It takes the context, reads `carried()` and returns the value to carry on.

```php
final readonly class PassCarried implements Pipe
{
    public function handle(PipelineContext $context): object
    {
        return $context->carried();
    }
}
```

### 4. The context and next: middleware

The pipe takes the context and the rest of the pipeline, and returns the pipeline's output. This is the form of
middleware written for any pipeline.

```php
final readonly class TimeAnswers implements Pipe
{
    public function handle(PipelineContext $context, Closure $next): object
    {
        $started = hrtime(true);
        $output = $next($context->carried());
        Log::info('answered', ['ms' => (hrtime(true) - $started) / 1e6]);

        return $output;
    }
}
```

## Middleware

Middleware is a pipe of form 2 or 4 that runs before a pipeline's own steps. You add it in `config/journal.php`,
keyed by the pipeline, so a module changes a pipeline's behaviour without touching the pipeline.

```php
'pipelines' => [
    'middleware' => [
        AnswerHookPipeline::class => [TimeAnswers::class],
    ],
],
```

## Steps listed inline

- `Step::conditional(condition, then:, else:)` runs the then steps when the condition holds of the carried value, and
  the else steps otherwise. With no else steps, the value goes on as it came. A branch hands the rest of the pipeline on
  as its own `$next`.
- `Step::repeated(steps, while:)` runs the steps round after round while the condition holds. Inside a round, `$next`
  ends at the end of the round.
- `Step::resolvedBy(resolver)` runs the pipe or pipeline the resolver names for the value.

## Inner pipelines and adapters

A pipeline can be listed as a step of another. It runs whole, with its own middleware, and what it hands out is carried
on. A pipe of form 2 or 4 inside it returns the inner pipeline's output.

A pipeline that takes or hands out a type the outer one does not carry is reached through an adapter.

```php
final readonly class RunShell extends PipelineAdapter
{
    protected function definition(): string
    {
        return ExecuteStepPipeline::class;
    }

    protected function produces(): string
    {
        return StepOutcome::class;
    }

    protected function into(object $input): PendingStep
    {
        return $input->innerShell();
    }

    protected function back(object $outcome, object $input): StepOutcome
    {
        return $outcome->withContext($input->context);
    }
}
```

Its `into` turns the carried value into the inner pipeline's input, and its `back` turns the inner output into the
value carried on.

## Checking every pipeline

`App\Pipelines\Support\PipelineValidator` reads every pipeline of core and the domains from its declarations, without
running it. It walks each pipeline from its input, with the configured middleware first.

- A pipe of form 1 or 2 must take every type the step before can carry.
- A pipe of form 1 or 3 carries on what it returns.
- A pipe of form 2 or 4 must return the pipeline's output, and it carries on what it was handed.
- An inner pipeline must take what is carried, and carries on its declared output.
- A conditional step carries on what either of its branches carries.
- The last value carried must be the pipeline's declared output.

`mixed`, `object` and a resolver's choice stand for types that only a run can tell, so they pass.

Run the check with `php artisan journal:pipelines`. It prints each fault, naming the pipeline, the pipe and both types,
and fails if there is any. `tests/Architecture/PipelineChainsTest.php` runs the same validator. The test also names a
broken fixture, `tests/Fixtures/Pipelines/Broken/CountDroppedCountPipeline.php`.

`PipelineRulesTest` keeps pipelines small: a pipeline of fewer than four pipes that is the step of exactly one other
pipeline is merged into it.
