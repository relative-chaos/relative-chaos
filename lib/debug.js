export const debug = (mode, state = true) => {
	console.debugModes = console.debugModes || {}
	console.debugModes = { ...console.debugModes, [mode]: state }
	return () => console.debugModes[mode]
}
