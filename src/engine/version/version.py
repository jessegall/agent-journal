# The engine's own version, which every module's requires_engine is checked against. An addition to the engine's
# contract raises the minor number; a public class, field or signature that is removed or changed raises the major
# number, so a suite built for 5.1 loads on 5.2 and is refused on 6.0.
ENGINE_VERSION = (5, 3, 0)
